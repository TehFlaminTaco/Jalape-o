using System;
using System.Net.NetworkInformation;
using System.Collections.Generic;
using System.Linq;

public static class JStack
{
    [Register("swap", 0x40)]
    public static void Swap(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            Var a = ip.stack.Pop();
            Var b = ip.stack.Pop();
            ip.stack.Push(a);
            ip.stack.Push(b);
        });
    }

    [Register("flip", 0x41)]
    public static void Flip(Interpreter ip)
    {
        Stack<Var> n = new();
        while (ip.stack.Count > 0) n.Push(ip.stack.Pop());
        ip.stack = n;
    }

    [Register("copy", 0x42)]
    public static void Copy(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            ip.stack.Push(a);
            ip.stack.Push(a);
        });
    }

    [Register("discard", 0x43)]
    public static void Discard(Interpreter ip)
    {
        if (ip.stack.Count > 0) ip.stack.Pop();
    }


    public static VarList VarToRange(Var a)
    {
        if (a is VarNumber n)
        {
            VarList l = new VarList();
            for (decimal i = 0; i < n.data; i++) l.data.Add(new VarNumber(i));
            return l;
        }
        if (a is VarList li)
        {
            VarList metaList = new VarList();
            for (var i = 0; i < li.data.Count; i++)
            {
                metaList.data.Add(VarToRange(li.data[i]));
            }
            return metaList;
        }
        return new VarList();
    }
    [Register("range", 0x44)]
    public static void Range(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            ip.stack.Push(VarToRange(a));
        });
    }

    [Register("save", 0x45)]
    public static void Save(Interpreter ip)
    {
        ip.Save();
    }
    [Register("load", 0x46)]
    public static void Load(Interpreter ip)
    {
        ip.Load();
    }
    [Register("loadunder", 0x47)]
    public static void LoadUnder(Interpreter ip)
    {
        Stack<Var> s = ip.stack;
        ip.Load();
        for (var i = 0; i < s.Count; i++)
        {
            ip.stack.Push(s.ElementAt(i));
        }
    }
    [Register("makelist", 0x48), Alias("pack")]
    public static void MakeList(Interpreter ip)
    {
        Stack<Var> s = ip.stack;
        ip.Load();
        VarList o = new();
        for (var i = s.Count - 1; i >= 0; i--)
        {
            o.data.Add(s.ElementAt(i));
        }
        ip.stack.Push(o);
    }
    [Register("unpack", 0x49)]
    public static void Unpack(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            if (a is not VarList) a = VarToRange(a);
            VarList al = a as VarList;
            for (var i = 0; i < al.data.Count; i++) ip.stack.Push(al.data[i]);
        });
    }

    private static (VarList, VarFunction) ListAndMethod(Interpreter ip, bool discarding = true)
    {
        Var b = ip.stack.Pop();
        Var a = ip.stack.Pop();
        if (a is not VarFunction && b is not VarFunction)
        {
            if (b is VarList bl1)
            {
                return (bl1, new VarFunction(ip => { if (discarding) ip.stack.Pop(); ip.stack.Push(a); }));
            }
            else if (a is VarList al1)
            {
                return (al1, new VarFunction(ip => { if (discarding) ip.stack.Pop(); ip.stack.Push(b); }));
            }
            return (VarToRange(a), new VarFunction(ip =>
            {
                if (discarding) ip.stack.Pop(); ip.stack.Push(b);
            }));
        }
        else
        {
            VarFunction f;
            Var o;
            if (a is VarFunction af)
            {
                f = af;
                o = b;
            }
            else
            {
                f = b as VarFunction;
                o = a;
            }

            if (o is VarList ol) return (ol, f);
            return (VarToRange(o), f);
        }
    }

    private static (VarList, Var) ListAndVar(Interpreter ip)
    {
        Var b = ip.stack.Pop();
        Var a = ip.stack.Pop();
        Var f;
        Var o;
        if (a is not VarList)
        {
            f = a;
            o = b;
        }
        else
        {
            f = b;
            o = a;
        }
        if (o is VarList ol) return (ol, f);
        return (VarToRange(o), f);
    }

    [Register("map", 0x4A)]
    public static void Map(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            (VarList bl, VarFunction f) = ListAndMethod(ip);
            VarList o = new();
            for (var i = 0; i < bl.data.Count; i++)
            {
                o.data.AddRange(f.CallSnatchAll(ip, bl.data[i]));
            }
            ip.stack.Push(o);
        });
    }

    [Register("reduce", 0x4B)]
    public static void Reduce(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            (VarList bl, VarFunction f) = ListAndMethod(ip);
            if (bl.data.Count == 0) return;
            if (bl.data.Count == 1)
            {
                ip.stack.Push(bl.data[0]);
                return;
            }
            Var n = bl.data[0];
            for (var i = 1; i < bl.data.Count; i++)
            {
                n = f.CallSnatchDefault(ip, new VarNumber(0), 1, n, bl.data[i])[0];
            }
            ip.stack.Push(n);
        });
    }

    [Register("fold", 0x4C)]
    public static void Fold(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            (VarList bl, VarFunction f) = ListAndMethod(ip);
            if (bl.data.Count == 0) ip.stack.Push(new VarList());
            if (bl.data.Count == 1) ip.stack.Push(bl.Clone());
            Var n = bl.data[0];
            VarList o = new VarList();
            for (var i = 1; i < bl.data.Count; i++)
            {
                o.data.AddRange(f.CallSnatchAll(ip, n, bl.data[i]));
                n = bl.data[i];
            }
            ip.stack.Push(o);
        });
    }
    [Register("cumulate", 0x4D)]
    public static void Cumulate(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            (VarList bl, VarFunction f) = ListAndMethod(ip);
            if (bl.data.Count == 0) ip.stack.Push(new VarList());
            if (bl.data.Count == 1) ip.stack.Push(bl.Clone());
            Var n = bl.data[0];
            VarList o = new VarList();
            for (var i = 1; i < bl.data.Count; i++)
            {
                o.data.Add(n = f.CallSnatchDefault(ip, new VarNumber(0), 1, n, bl.data[i])[0]);
            }
            ip.stack.Push(o);
        });
    }

    [Register("transpose", 0x4E)]
    public static void Transpose(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            VarList o = new();
            Var a = ip.stack.Pop();
            if (a is not VarList)
            {
                a = VarToRange(a);
            }
            VarList al = a as VarList;
            for (var i = 0; i < al.data.Count; i++)
            {
                if (al.data[i] is VarList l)
                {
                    for (var j = 0; j < l.data.Count; j++)
                    {
                        while (o.data.Count <= j) o.data.Add(new VarList());
                        (o.data[j] as VarList).data.Add(l.data[j]);
                    }
                }
                else
                {
                    if (o.data.Count == 0) o.data.Add(new VarList());
                    (o.data[0] as VarList).data.Add(al.data[i]);
                }
            }
            ip.stack.Push(o);
        });
    }

    [Register("sort", 0x4F)]
    public static void Sort(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 1, ip =>
        {
            void Process()
            {
                (VarList bl, VarFunction f) = ListAndMethod(ip);
                VarList l = new();
                l.data = bl.data.OrderBy(c => c, new VarComparer(f, ip)).ToList();
                ip.stack.Push(l);
            }

            if (ip.stack.Peek() is VarFunction)
            {
                Curry.ExpectFunctions(ip, 2, ip =>
                {
                    Process();
                });
            }
            else
            {
                ip.stack.Push(new VarFunction(ip => JMath.Compare(ip)));
                Process();
            }
        });
    }

    [Register("where", 0x50)]
    public static void Where(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            (VarList bl, VarFunction f) = ListAndMethod(ip);
            VarList o = new();
            for (var i = 0; i < bl.data.Count; i++)
            {
                Var t = f.CallSnatchDefault(ip, new VarNumber(0), 1, bl.data[i])[0];
                if (t.Truthy())
                    o.data.Add(bl.data[i]);
            }
            ip.stack.Push(o);
        });
    }

    [Register("takewhile", 0x51)]
    public static void TakeWhile(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            (VarList bl, VarFunction f) = ListAndMethod(ip);
            VarList o = new();
            for (var i = 0; i < bl.data.Count; i++)
            {
                Var t = f.CallSnatchDefault(ip, new VarNumber(0), 1, bl.data[i])[0];
                if (t.Truthy())
                    o.data.Add(bl.data[i]);
                else break;
            }
            ip.stack.Push(o);
        });
    }

    [Register("reverse", 0x52), Alias("negate")]
    public static void Reverse(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            if (a is VarNumber n)
            {
                ip.stack.Push(new VarNumber(-n.data));
                return;
            }
            if (a is VarList l)
            {
                VarList nl = new VarList();
                nl.data = l.data.Reverse<Var>().ToList();
                ip.stack.Push(nl);
            }
        });
    }

    [Register("length", 0x53)]
    public static void Length(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            if (a is VarList al)
            {
                ip.stack.Push(new VarNumber(al.data.Count));
                return;
            }
            ip.stack.Push(a);
        });
    }

    [Register("pullup", 0x54)]
    public static void PullUp(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stack.Push(ip.stackStack.Peek().Pop());
    }

    [Register("pushdown", 0x55)]
    public static void PushDown(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stackStack.Push(new());
        if (ip.stack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stackStack.Peek().Push(ip.stack.Pop());
    }

    [Register("push", 0x56)]
    public static void Push(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            (VarList l, Var v) = ListAndVar(ip);
            l.data.Add(v);
            ip.stack.Push(l);
        });
    }
    [Register("enqueue", 0x57)]
    public static void Enqueue(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            (VarList l, Var v) = ListAndVar(ip);
            l.data.Insert(0, v);
            ip.stack.Push(l);
        });
    }
    [Register("pop", 0x58)]
    public static void Pop(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            Var v = ip.stack.Pop();
            if (v is VarList l && l.data.Count > 0)
                l.data.RemoveAt(l.data.Count - 1);
            ip.stack.Push(v);
        });
    }
    [Register("dequeue", 0x59)]
    public static void Dequeue(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            Var v = ip.stack.Pop();
            if (v is VarList l && l.data.Count > 0)
                l.data.RemoveAt(0);
            ip.stack.Push(v);
        });
    }

    [Register("copy0", 0x5A)]
    public static void Pull0(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stack.Push(ip.stackStack.Peek().ElementAtOrDefault(0) ?? new VarNumber(0));
    }
    [Register("copy1", 0x5B)]
    public static void Pull1(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stack.Push(ip.stackStack.Peek().ElementAtOrDefault(1) ?? new VarNumber(0));
    }
    [Register("copy2", 0x5C)]
    public static void Pull2(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stack.Push(ip.stackStack.Peek().ElementAtOrDefault(2) ?? new VarNumber(0));
    }
    [Register("arg0", 0x60)]
    public static void Arg0(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stack.Push(ip.stackStack.Last().ElementAtOrDefault(0) ?? new VarNumber(0));
    }
    [Register("arg1", 0x61)]
    public static void Arg1(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stack.Push(ip.stackStack.Last().ElementAtOrDefault(1) ?? new VarNumber(0));
    }
    [Register("arg2", 0x62)]
    public static void Arg2(Interpreter ip)
    {
        if (ip.stackStack.Count == 0) ip.stack.Push(new VarNumber(0));
        ip.stack.Push(ip.stackStack.Last().ElementAtOrDefault(2) ?? new VarNumber(0));
    }

    [Register("contains", 0x5D), Alias("any")]
    public static void Contains(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            Var a = ip.stack.Pop();
            Var b = ip.stack.Pop();
            if (b is VarFunction f)
            {
                if (a is not VarList) a = VarToRange(a);
                VarList al = a as VarList;
                for (var i = 0; i < al.data.Count; i++)
                {
                    if (f.CallSnatchDefault(ip, new VarNumber(0), 1, al.data[i])[0].Truthy())
                    {
                        ip.stack.Push(new VarNumber(1));
                        return;
                    }
                }
                ip.stack.Push(new VarNumber(0));
                return;
            }
            if (a is VarList || b is VarList)
            {
                if (a is not VarList)
                {
                    (a, b) = (b, a);
                }
                VarList haystack = a as VarList;
                Var needle = b;
                for (var i = 0; i < haystack.data.Count; i++)
                {
                    if (JMath.CompareVars(haystack.data[i], needle) is VarNumber N && N.data == 0)
                    {
                        ip.stack.Push(new VarNumber(1));
                        return;
                    }
                }
                ip.stack.Push(new VarNumber(0));
                return;
            }
            if (JMath.CompareVars(a, b) is VarNumber n && n.data == 0)
            {
                ip.stack.Push(new VarNumber(1));
                return;
            }
            ip.stack.Push(new VarNumber(0));
        });
    }

    [Register("first", 0x5E)]
    public static void First(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            if (ip.stack.Count == 0)
            { // In positive integers
                VarFunction f;
                if (a is VarFunction F)
                {
                    f = F;
                }
                else
                {
                    f = new VarFunction(j =>
                    {
                        Var k = ip.stack.Pop();
                        if (JMath.CompareVars(k, a) is VarNumber n && n.data == 0) ip.stack.Push(new VarNumber(1));
                        else ip.stack.Push(new VarNumber(0));
                    });
                }
                for (int i = 0; true; i++)
                {
                    if (f.CallSnatchDefault(ip, new VarNumber(0), 1, new VarNumber(i))[0].Truthy())
                    {
                        ip.stack.Push(new VarNumber(i));
                        return;
                    }
                }
            }
            else
            { // In a listlike
                ip.stack.Push(a);
                (VarList l, VarFunction f) = ListAndMethod(ip);
                for (var i = 0; i < l.data.Count; i++)
                {
                    if (f.CallSnatchDefault(ip, new VarNumber(0), 1, l.data[i])[0].Truthy())
                    {
                        ip.stack.Push(l.data[i]);
                        return;
                    }
                }
            }
        });
    }

    public static VarNumber VarAverage(Var v)
    {
        if (v is VarNumber n)
        {
            return new VarNumber(n.data / 2);
        }
        if (v is VarList l)
        {
            decimal sum = 0;
            for (var i = 0; i < l.data.Count; i++)
            {
                Var vi = l.data[i];
                if (vi is not VarNumber)
                {
                    vi = VarAverage(vi);
                }
                sum += (vi as VarNumber).data;
            }
            return new VarNumber(sum / l.data.Count);
        }
        return new VarNumber(0);
    }

    [Register("average", 0x5F), Alias("mean")]
    public static void Average(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(VarAverage(ip.stack.Pop()));
        });
    }

    public static VarNumber VarSum(Var v)
    {
        if (v is VarList l)
        {
            decimal sum = 0;
            for (var i = 0; i < l.data.Count; i++)
            {
                if (l.data[i] is VarNumber n) sum += n.data;
                else sum += VarSum(l.data[i]).data;
            }
            return new VarNumber(sum);
        }
        if (v is VarNumber)
        {
            return VarSum(Strings.VarToDigits(v));
        }
        return VarSum(VarToRange(v));
    }

    [Register("sum", 0x64)]
    public static void Sum(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(VarSum(ip.stack.Pop()));
        });
    }

    public static Var VarRepeat(VarList l, Var b)
    {
        if (b is VarNumber n)
        {
            // If n is negative, reverse the list after we're done.
            bool backwards = n.data < 0;
            if (backwards) n = new VarNumber(-n.data);

            // Repeat it an Integral amount of times
            VarList o = new VarList();
            for (int i = 0; i < n.data; i++)
            {
                for (int j = 0; j < l.data.Count; j++)
                {
                    o.data.Add(l.data[j]);
                }
            }

            // Get the fractional component
            int fract = (int)((n.data % 1) * l.data.Count);
            for (int j = 0; j < fract; j++)
            {
                o.data.Add(l.data[j]);
            }

            if (backwards) o.data.Reverse();
            return o;
        }
        else if (b is VarList bl)
        {
            VarList o = new VarList();
            for (int i = 0; i < bl.data.Count; i++)
            {
                o.data.Add(VarRepeat(l, bl.data[i]));
            }
            return o;
        }
        return l;
    }

    [Register("repeat", 0x65)]
    public static void Repeat(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            (VarList l, Var b) = ListAndVar(ip);
            ip.stack.Push(VarRepeat(l, b));
        });
    }

    [Register("empty", 0x66)]
    public static void Empty(Interpreter ip)
    {
        ip.stack.Push(new VarList());
    }

    public static VarNumber VarProduct(Var v)
    {
        if (v is VarList l)
        {
            decimal sum = 1;
            for (var i = 0; i < l.data.Count; i++)
            {
                if (l.data[i] is VarNumber n) sum *= n.data;
                else sum *= VarProduct(l.data[i]).data;
            }
            return new VarNumber(sum);
        }
        if (v is VarNumber)
        {
            return VarProduct(Strings.VarToDigits(v));
        }
        return VarProduct(VarToRange(v));
    }

    [Register("product", 0x67)]
    public static void Product(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(VarProduct(ip.stack.Pop()));
        });
    }

    /*public static Var VarIndex(VarList l, Var i){
        if(i is VarNumber){
            
        }
    }

    [Register("index")]
    public static void Index(Interpreter ip)
    {
        Curry.Expect(ip, 2, ip =>
        {
            (VarList l, Var i) = ListAndVar(ip);
            
        });
    }*/
}