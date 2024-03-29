using System.Collections.Generic;
using System.Linq;

public class Flow
{
    [Register("ret", 0x10)]
    public static void Ret(Interpreter ip) { ip.IP = ip.byteCode.Length; }

    [Register("func", 0x1F, terminator = "ret", takeFunctions = true)]
    public static void Func(Interpreter ip, byte[] data)
    {
        List<VarFunction> functions = new();
        var i = 0;
        while (i < data.Length) functions.Add(Interpreter.TakeFunction(data, ref i));
        ip.stack.Push(new VarFunction(ip => ip.Execute(functions)));
    }
    [Register("asfunc", 0x11, byteCount = 1, takeFunctions = true)]
    public static void AsFunc(Interpreter ip, byte[] data)
    {
        var i = 0;
        ip.stack.Push(Interpreter.TakeFunction(data, ref i));
    }
    [Register("aspair", 0x12, byteCount = 2, takeFunctions = true)]
    public static void AsPair(Interpreter ip, byte[] data)
    {
        List<VarFunction> functions = new();
        var i = 0;
        while (i < data.Length) functions.Add(Interpreter.TakeFunction(data, ref i));
        ip.stack.Push(new VarFunction(ip => ip.Execute(functions)));
    }
    [Register("astrio", 0x13, byteCount = 3, takeFunctions = true)]
    public static void AsTrio(Interpreter ip, byte[] data)
    {
        List<VarFunction> functions = new();
        var i = 0;
        while (i < data.Length) functions.Add(Interpreter.TakeFunction(data, ref i));
        ip.stack.Push(new VarFunction(ip => ip.Execute(functions)));
    }

    [Register("call", 0x14)]
    public static void Call(Interpreter ip)
    {
        Var l = null;
        Stack<Var> q = new();
        while (ip.stack.Count > 0 && (l = ip.stack.Pop()) is not VarFunction)
        {
            q.Push(l);
        }
        while (q.Count > 0) ip.stack.Push(q.Pop());
        if (l is VarFunction F)
            F.Call(ip);
    }

    [Register("while", 0x15)]
    public static void While(Interpreter ip)
    {
        Curry.ExpectFunctions(ip, 1, ip =>
        {
            Var f = ip.stack.Pop();
            if (f is not VarFunction) while (f.Truthy()) { };
            var F = f as VarFunction;
            while (true)
            {
                F.Call(ip);
                if (ip.stack.Count == 0) return;
                if (!ip.stack.Pop().Truthy()) return;
            }
        });
    }
}