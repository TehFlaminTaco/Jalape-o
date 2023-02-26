using System.Collections.Generic;
using System.Linq;

public class Flow
{
    [Register("ret")]
    public static void Ret(Interpreter ip) { ip.IP = ip.byteCode.Length; }

    [Register("func", terminator = "ret", takeFunctions = true)]
    public static void Func(Interpreter ip, byte[] data)
    {
        List<VarFunction> functions = new();
        var i = 0;
        while (i < data.Length) functions.Add(Interpreter.TakeFunction(data, ref i));
        ip.Execute(functions);
    }

    [Register("call")]
    public static void Func(Interpreter ip)
    {
        if (ip.stack.Count == 0) return;
        if (ip.stack.Peek() is not VarFunction) return;
        (ip.stack.Pop() as VarFunction).Call(ip);
    }

    [Register("map")]
    public static void Map(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 2, ip =>
        {
            Var b = ip.stack.Pop();
            Var a = ip.stack.Pop();
            if (b is not VarFunction && a is not VarFunction)
            {
                if (b is VarList vl)
                {
                    VarList l = new();
                    for (var i = 0; i < vl.data.Count; i++) l.data.Add(a);
                    ip.stack.Push(l);
                    return;
                }
                else
                {
                    if (a is not VarList)
                    {
                        a = Stack.VarToRange(a);
                    }
                    VarList al = a as VarList;
                    VarList l = new();
                    for (var i = 0; i < al.data.Count; i++) l.data.Add(b);
                    ip.stack.Push(l);
                    return;
                }
            }
            else if (b is VarFunction)
            {
                (b, a) = (a, b);
            }
            VarFunction f = a as VarFunction;
            if (b is not VarList)
            {
                b = Stack.VarToRange(b);
            }
            VarList bl = b as VarList;
            VarList o = new();
            for (var i = 0; i < bl.data.Count; i++)
            {
                ip.Save();
                ip.stack.Push(bl.data[i]);
                f.Call(ip);
                for (int j = 0; j < ip.stack.Count; j++) o.data.Add(ip.stack.ElementAt(j));
                ip.Load();
            }
            ip.stack.Push(o);
        });
    }
}