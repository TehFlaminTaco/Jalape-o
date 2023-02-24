public class Math
{
    public static Var AddVars(Var a, Var b)
    {
        if (a is VarNumber an && b is VarNumber bn)
        {
            return new VarNumber(an.data + bn.data);
        }
        if (a is VarList alp && b is VarList blp)
        {
            VarList n = new VarList();
            for (var i = 0; i < alp.data.Count; i++) n.data.Add(alp.data[i]);
            for (var i = 0; i < blp.data.Count; i++) n.data.Add(blp.data[i]);
            return n;
        }
        if (a is VarList al)
        {
            VarList n = new VarList();
            for (var i = 0; i < al.data.Count; i++) n.data.Add(al.data[i]);
            n.data.Add(b);
            return n;
        }
        if (b is VarList bl)
        {
            VarList n = new VarList();
            n.data.Add(a);
            for (var i = 0; i < bl.data.Count; i++) n.data.Add(bl.data[i]);
            return n;
        }
        return new VarNumber(0);
    }

    [Register("add")]
    public static void Add(Interpreter ip)
    {
        Curry.Expect(ip, 2, (ip) =>
        {
            Var b = ip.stack.Pop();
            Var a = ip.stack.Pop();
            ip.stack.Push(AddVars(a, b));
        });
    }
}