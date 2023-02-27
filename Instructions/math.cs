using System;
using System.Collections.Generic;

public class Math
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
    [Register("add")] public static void Add(Interpreter ip) { DoMath(ip, (a, b) => a + b); }
    [Register("sub")] public static void Sub(Interpreter ip) { DoMath(ip, (a, b) => a - b); }
    [Register("mul")] public static void Mul(Interpreter ip) { DoMath(ip, (a, b) => a * b); }
    [Register("div")] public static void Div(Interpreter ip) { DoMath(ip, (a, b) => a / b); }
    [Register("intdiv")] public static void IntDiv(Interpreter ip) { DoMath(ip, (a, b) => Decimal.Floor(a / b)); }
    [Register("mod")] public static void Mod(Interpreter ip) { DoMath(ip, (a, b) => a % b); }
    [Register("pow")] public static void Pow(Interpreter ip) { DoMath(ip, (a, b) => (decimal)System.Math.Pow((double)a, (double)b)); }
    [Register("band")] public static void BAnd(Interpreter ip) { DoMath(ip, (a, b) => (int)a & (int)b); }
    [Register("bor")] public static void BOr(Interpreter ip) { DoMath(ip, (a, b) => (int)a | (int)b); }
    [Register("bxor")] public static void BXor(Interpreter ip) { DoMath(ip, (a, b) => (int)a ^ (int)b); }
    [Register("bshl")] public static void BShl(Interpreter ip) { DoMath(ip, (a, b) => (int)a << (int)b); }
    [Register("bshr")] public static void BShr(Interpreter ip) { DoMath(ip, (a, b) => (int)a >> (int)b); }
    [Register("lt")] public static void Lt(Interpreter ip) { CompareLike(ip, i => i < 0); }
    [Register("le")] public static void Le(Interpreter ip) { CompareLike(ip, i => i <= 0); }
    [Register("gt")] public static void Gt(Interpreter ip) { CompareLike(ip, i => i > 0); }
    [Register("ge")] public static void Ge(Interpreter ip) { CompareLike(ip, i => i >= 0); }
    [Register("eq")] public static void Eq(Interpreter ip) { CompareLike(ip, i => i == 0); }
    [Register("ne")] public static void Ne(Interpreter ip) { CompareLike(ip, i => i != 0); }

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
    [Register("compare")]
    public static void Compare(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            Var a = ip.stack.Pop();
            Var b = ip.stack.Pop();
            ip.stack.Push(CompareVars(a, b));
        });
    }
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