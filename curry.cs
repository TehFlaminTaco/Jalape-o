using System;
using System.Collections.Generic;
public static class Curry
{
    public static void Expect(Interpreter ip, int count, Action<Interpreter> resolve)
    {
        int initialCount = count;
        Stack<Var> q = new();
        Action<Interpreter> finish = ip =>
        {
            Stack<Var> Q = new(q);
            while (Q.Count > 0) ip.stack.Push(Q.Pop());
            if (ip.stack.Count < initialCount) throw new Exception($"Failed curry? wanted {initialCount} got {ip.stack.Count}");
            resolve(ip);
        };
        while (q.Count < initialCount)
        {
            if (ip.stack.Count == 0)
            {
                ip.stack.Push(new VarFunction(ip => Curry.Expect(ip, count, finish)));
                return;
            }
            Var p = ip.stack.Pop();
            if (p is VarFunction f)
            {
                f.Call(ip);
                if (ip.stack.Peek() is VarFunction)
                { // Failed curry
                    ip.stack.Push(new VarFunction(ip => Curry.Expect(ip, count, finish)));
                    return;
                }
                else
                {
                    continue;
                }
            }
            q.Push(p);
            count--;
        }
        finish(ip);
        return;
    }
    public static void ExpectFunctions(Interpreter ip, int count, Action<Interpreter> resolve)
    {
        Stack<Var> q = new();
        Action<Interpreter> finish = ip =>
        {
            while (q.Count > 0) ip.stack.Push(q.Pop());
            resolve(ip);
        };
        while (count > 0)
        {
            if (ip.stack.Count == 0)
            {
                ip.stack.Push(new VarFunction(ip => Curry.ExpectFunctions(ip, count, finish)));
                return;
            }
            q.Push(ip.stack.Pop());
            count--;
        }
        finish(ip);
        return;
    }
}