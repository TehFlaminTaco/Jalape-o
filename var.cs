using System.Text;
using System.Collections.Generic;
using System;
using System.Linq;

abstract public class Var
{

}

public class VarNumber : Var
{
    public decimal data;
    public VarNumber()
    {
        data = 0;
    }
    public VarNumber(decimal d)
    {
        this.data = d;
    }

    public override string ToString()
    {
        return data.ToString();
    }
}

public class VarList : Var
{
    public List<Var> data = new();
    public VarList()
    {

    }

    public VarList(string s)
    {
        foreach (byte c in Encoding.UTF8.GetBytes(s))
        {
            data.Add(new VarNumber(c));
        }
    }

    public override string ToString()
    {
        if (data.All(c => c is VarNumber n && (n.data % 1 == 0) && (n.data >= 0) && (n.data < 255))) // String-like
        {
            return System.Text.Encoding.UTF8.GetString(data.Select(c=>(byte)(((VarNumber)c).data)).ToArray());
        }else{
            return "[" + String.Join(", ", data) + "]";
        }
    }
}

public class VarFunction : Var
{
    public Action<Interpreter> action;
    public VarFunction(Action<Interpreter> action)
    {
        this.action = action;
    }

    public void Call(Interpreter ip)
    {
        this.action.Invoke(ip);
    }

    public override string ToString()
    {
        return "[Function]";
    }
}