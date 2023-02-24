public static class Stack
{
    [Register("swap")]
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
    [Register("range")]
    public static void Range(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            ip.stack.Push(VarToRange(a));
        });
    }
}