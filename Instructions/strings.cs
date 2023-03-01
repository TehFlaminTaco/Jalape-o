using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Reflection;
using System.IO;

public static class Strings
{
    public static string[] Dict = null;
    public static void ParseDictionary()
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = assembly.GetManifestResourceNames().First(c => c.EndsWith("dictionary.txt"));
        var dictStream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        Dict = new StreamReader(dictStream).ReadToEnd().Split('\n');
    }

    [Register("tostring")]
    public static void VarToString(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(new VarList(ip.stack.Pop().ToString()));
        });
    }


    public static VarList VarToDigits(Var v, int bse = 10)
    {
        if (v is VarList vl)
        {
            VarList o = new();
            for (var i = 0; i < vl.data.Count; i++)
            {
                o.data.Add(VarToDigits(vl.data[i]));
            }
            return o;
        }
        if (v is VarNumber vn)
        {
            if (vn.data == 0) return new VarList("0");
            VarList o = new();
            decimal n = vn.data;
            while (n >= 1)
            {
                o.data.Insert(0, new VarNumber((decimal)MathF.Floor((float)(n % bse))));
                n /= bse;
            }
            return o;
        }
        return new VarList();
    }

    [Register("digits")]
    public static void Digits(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(VarToDigits(ip.stack.Pop()));
        });
    }

    [Register("tobase")]
    public static void ToBase(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            Var b;
            if (ip.stack.Count == 0)
            {
                b = new VarNumber(2);
            }
            else
            {
                b = ip.stack.Pop();
            }
            ip.stack.Push(Var.WithNumbers(a, b, (an, bn) => VarToDigits(an, (int)bn.data), new VarList()));
        });
    }

    [Register("join")]
    public static void Join(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            Var deliminator;
            if (a is not VarList)
            {
                if (ip.stack.Count > 0 && ip.stack.Peek() is VarList)
                {
                    deliminator = a;
                    a = ip.stack.Pop();
                }
                else
                {
                    a = JStack.VarToRange(a);
                    if (ip.stack.Count > 0) deliminator = ip.stack.Pop();
                    else deliminator = new VarList(",");
                }
            }
            else
            {
                if (ip.stack.Count > 0) deliminator = ip.stack.Pop();
                else deliminator = new VarList(",");
            }
            if (deliminator is not VarList l) deliminator = new VarList("" + deliminator);
            VarList o = new();
            VarList al = a as VarList;
            VarList dl = deliminator as VarList;
            string ds = dl.ToString();
            for (var i = 0; i < al.data.Count; i++)
            {
                if (i > 0)
                {
                    foreach (var c in ShortUF8.ToShortBytes(ds))
                    {
                        o.data.Add(new VarNumber(c));
                    }
                }
                foreach (var c in ShortUF8.ToShortBytes(al.data[i].ToString()))
                {
                    o.data.Add(new VarNumber(c));
                }
            }
            ip.stack.Push(o);
        });
    }

    [Register("print")]
    public static void Print(Interpreter ip){
        Curry.Expect(ip, 1, ip => {
            Console.WriteLine(ip.stack.Pop()); 
        });
    }
    [Register("write")]
    public static void Write(Interpreter ip){
        Curry.Expect(ip, 1, ip => {
            Console.Write(ip.stack.Pop()); 
        });
    }
}