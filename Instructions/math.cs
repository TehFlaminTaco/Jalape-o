using System.Runtime.InteropServices;
using System;
using System.Linq;
using System.Collections.Generic;

public class JMath
{
    public static void DoMath(Interpreter ip, Func<decimal, decimal, decimal> method)
    {
        Curry.Expect(ip, 2, ip =>
        {
            Var a = ip.stack.Pop();
            Var b = ip.stack.Pop();
            ip.stack.Push(Var.WithNumbers(a, b, (an, bn) =>
            {
                return new VarNumber(method(an.data, bn.data));
            }, new VarNumber(0)));
        });
    }
    public static void CompareLike(Interpreter ip, Func<int, bool> method)
    {
        Curry.Expect(ip, 2, ip =>
        {
            Var b = ip.stack.Pop();
            Var a = ip.stack.Pop();
            Var compared = CompareVars(a, b);
            if (compared is VarNumber n) ip.stack.Push(new VarNumber(method((int)n.data) ? 1 : 0));
            else ip.stack.Push(new VarNumber(method(0) ? 1 : 0));
        });
    }
    [Register("add", 0x20), Alias("+")] public static void Add(Interpreter ip) { DoMath(ip, (a, b) => a + b); }
    [Register("sub", 0x21), Alias("-")] public static void Sub(Interpreter ip) { DoMath(ip, (a, b) => a - b); }
    [Register("mul", 0x22), Alias("*")] public static void Mul(Interpreter ip) { DoMath(ip, (a, b) => a * b); }
    [Register("div", 0x23), Alias("/")] public static void Div(Interpreter ip) { DoMath(ip, (a, b) => a / b); }
    [Register("intdiv", 0x24)] public static void IntDiv(Interpreter ip) { DoMath(ip, (a, b) => Decimal.Floor(a / b)); }
    [Register("mod", 0x25), Alias("%")] public static void Mod(Interpreter ip) { DoMath(ip, (a, b) => a % b); }
    [Register("pow", 0x26), Alias("^")] public static void Pow(Interpreter ip) { DoMath(ip, (a, b) => (decimal)System.Math.Pow((double)a, (double)b)); }
    [Register("band", 0x27), Alias("&")] public static void BAnd(Interpreter ip) { DoMath(ip, (a, b) => (int)a & (int)b); }
    [Register("bor", 0x28), Alias("|")] public static void BOr(Interpreter ip) { DoMath(ip, (a, b) => (int)a | (int)b); }
    [Register("bxor", 0x29), Alias("~")] public static void BXor(Interpreter ip) { DoMath(ip, (a, b) => (int)a ^ (int)b); }
    [Register("bshl", 0x2A)] public static void BShl(Interpreter ip) { DoMath(ip, (a, b) => (int)a << (int)b); }
    [Register("bshr", 0x2B)] public static void BShr(Interpreter ip) { DoMath(ip, (a, b) => (int)a >> (int)b); }
    [Register("lt", 0x2C)] public static void Lt(Interpreter ip) { CompareLike(ip, i => i < 0); }
    [Register("le", 0x2D)] public static void Le(Interpreter ip) { CompareLike(ip, i => i <= 0); }
    [Register("gt", 0x2E)] public static void Gt(Interpreter ip) { CompareLike(ip, i => i > 0); }
    [Register("ge", 0x2F)] public static void Ge(Interpreter ip) { CompareLike(ip, i => i >= 0); }
    [Register("eq", 0x30)] public static void Eq(Interpreter ip) { CompareLike(ip, i => i == 0); }
    [Register("ne", 0x31)] public static void Ne(Interpreter ip) { CompareLike(ip, i => i != 0); }

    [Register("not", 0x32)]
    public static void Not(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(ip.stack.Pop().Truthy() ? new VarNumber(0) : new VarNumber(1));
        });
    }
    [Register("truthy", 0x33)]
    public static void Truthy(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(ip.stack.Pop().Truthy() ? new VarNumber(1) : new VarNumber(0));
        });
    }

    public static Var IncVar(Var v)
    {
        if (v is VarNumber n)
        {
            return new VarNumber(n.data + 1);
        }
        if (v is VarList l)
        {
            l.data = l.data.Select(IncVar).ToList();
        }
        return v;
    }
    public static Var DecVar(Var v)
    {
        if (v is VarNumber n)
        {
            return new VarNumber(n.data - 1);
        }
        if (v is VarList l)
        {
            l.data = l.data.Select(DecVar).ToList();
        }
        return v;
    }

    [Register("inc", 0x34)]
    public static void Inc(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(IncVar(ip.stack.Pop()));
        });
    }
    [Register("dec", 0x35)]
    public static void Dec(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(DecVar(ip.stack.Pop()));
        });
    }

    public static Var CompareVars(Var a, Var b)
    {
        VarList al = a as VarList;
        VarList bl = b as VarList;
        VarNumber an = a as VarNumber;
        VarNumber bn = b as VarNumber;
        if (a is VarList && b is VarList)
        {
            for (var i = 0; i < al.data.Count; i++)
            {
                if (bl.data.Count <= i)
                {
                    return new VarNumber(-1);
                }
                var c = CompareVars(al.data[i], bl.data[i]);
                if (c is not VarNumber compared) continue;
                if (compared.data == 0m)
                {
                    continue;
                }
                return compared;
            }
            if (bl.data.Count == al.data.Count) return new VarNumber(0);
            return new VarNumber(1);
        }
        if ((b is VarList && a is VarNumber) || (b is VarNumber && a is VarList))
        {
            VarList l = (a is VarList) ? al : bl;
            VarNumber n = (a is VarList) ? bn : an;
            VarList o = new VarList();
            for (var i = 0; i < l.data.Count; i++)
            {
                o.data.Add(CompareVars(l.data[i], n));
            }
            return o;
        }
        if (a is VarNumber && b is VarNumber)
        {
            return new VarNumber(an.data - bn.data);
        }
        return new VarNumber(0m);
    }
    [Register("compare", 0x36)]
    public static void Compare(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            Var a = ip.stack.Pop();
            Var b = ip.stack.Pop();
            ip.stack.Push(CompareVars(a, b));
        });
    }

    /*public static Var VarLerp(Var a, Var b, decimal t)
    {
        VarNumber an = a as VarNumber;
        VarNumber bn = b as VarNumber;
        VarList al = a as VarList;
        VarList bl = b as VarList;
        if (a is VarNumber && b is VarNumber)
        {
            return new VarNumber((bn.data - an.data) * t + an.data);
        }
        if(a is VarList && b is VarList){
            
        }
    }*/
}

public class VarComparer : IComparer<Var>
{
    VarFunction compare;
    Interpreter ip;
    public VarComparer(VarFunction c, Interpreter ip)
    {
        this.compare = c;
        this.ip = ip;
    }
    public int Compare(Var x, Var y)
    {
        Var n = this.compare.CallSnatchDefault(this.ip, new VarNumber(0), 1, x, y)[0];
        if (n is VarNumber vn) return (int)vn.data;
        return 0;
    }
}