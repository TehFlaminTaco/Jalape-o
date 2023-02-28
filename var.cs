using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using System;
using System.Linq;

abstract public class Var
{
    public static Var WithNumbers(Var a, Var b, Func<VarNumber, VarNumber, Var> method, Var def = null)
    {
        if (a is VarFunction || b is VarFunction) return def;
        VarNumber an = a as VarNumber;
        VarNumber bn = b as VarNumber;
        VarList al = a as VarList;
        VarList bl = b as VarList;
        if (b is VarList)
        {
            var o = new VarList();
            for (var i = 0; i < bl.data.Count; i++)
            {
                o.data.Add(WithNumbers(a, bl.data[i], method, def));
            }
            return o;
        }
        if (a is VarList)
        {
            var o = new VarList();
            for (var i = 0; i < al.data.Count; i++)
            {
                o.data.Add(WithNumbers(al.data[i], b, method, def));
            }
            return o;
        }
        if (a is VarNumber && b is VarNumber)
        {
            return method(an, bn);
        }
        return def;
    }

    public abstract Var Clone();
    public abstract bool Truthy();

    public static Var FromJsonElement(JsonElement e){
        switch(e.ValueKind){
            case JsonValueKind.Array: {
                VarList l = new();
                for (var i = 0; i < e.GetArrayLength(); i++){
                    l.data.Add(FromJsonElement(e[i]));
                }
                return l;
            }
            case JsonValueKind.Number: {
                return new VarNumber(e.GetDecimal());
            }
            case JsonValueKind.String: {
                return new VarList(e.GetString());
            }
            case JsonValueKind.True: {
                return new VarNumber(1);
            }
        }
        return new VarNumber(0);
    }

    public static Var FromInput(string s){
        dynamic v = JsonSerializer.Deserialize<dynamic>(s);
        if(v is JsonElement e){
            return FromJsonElement(e);
        }
        return new VarNumber(0);
    }
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

    public override VarNumber Clone() { return new VarNumber(this.data); }
    public override bool Truthy() { return this.data != 0; }
}

public class VarList : Var
{
    public List<Var> data = new();
    public VarList()
    {

    }

    public VarList(string s)
    {
        foreach (byte c in ShortUF8.ToShortBytes(s))
        {
            data.Add(new VarNumber(c));
        }
    }

    public override string ToString()
    {
        if (data.All(c => c is VarNumber n && (n.data % 1 == 0) && (n.data >= 0) && (n.data <= 255))) // String-like
        {
            return ShortUF8.ToRegularString(data.Select(c => (byte)(((VarNumber)c).data)).ToArray());
        }
        else
        {
            return "[" + String.Join(", ", data.Select(c => c.ToString())) + "]";
        }
    }

    public override VarList Clone()
    {
        VarList n = new();
        for (var i = 0; i < this.data.Count; i++)
        {
            n.data.Add(this.data[i].Clone());
        }
        return n;
    }

    public override bool Truthy() { return this.data.Count > 0; }
}

public class VarFunction : Var
{
    public int? expectedArguments = null;
    public Action<Interpreter> action;
    public VarFunction(Action<Interpreter> action)
    {
        this.action = action;
    }

    public void Call(Interpreter ip)
    {
        this.action.Invoke(ip);
    }

    public Var[] CallSnatchAll(Interpreter ip, params Var[] arguments)
    {
        ip.Save();
        for (var i = 0; i < arguments.Length; i++) ip.stack.Push(arguments[i]);
        this.Call(ip);
        int snatchCount = ip.stack.Count;
        Var[] oot = new Var[snatchCount];
        for (int i = 0; i < snatchCount; i++)
        {
            oot[i] = ip.stack.ElementAt(ip.stack.Count - snatchCount + i);
        }
        ip.Load();
        return oot;
    }
    public Var[] CallSnatch(Interpreter ip, int snatchCount = 1, params Var[] arguments)
    {
        ip.Save();
        for (var i = 0; i < arguments.Length; i++) ip.stack.Push(arguments[i]);
        this.Call(ip);
        if (ip.stack.Count < snatchCount) snatchCount = ip.stack.Count;
        Var[] oot = new Var[snatchCount];
        for (int i = 0; i < snatchCount; i++)
        {
            oot[i] = ip.stack.ElementAt(ip.stack.Count - snatchCount + i);
        }
        ip.Load();
        return oot;
    }
    public Var[] CallSnatchDefault(Interpreter ip, Var def, int snatchCount = 1, params Var[] arguments)
    {
        ip.Save();
        for (var i = 0; i < arguments.Length; i++) ip.stack.Push(arguments[i]);
        this.Call(ip);
        int c = snatchCount;
        if (ip.stack.Count < c) c = ip.stack.Count;
        Var[] oot = new Var[snatchCount];
        for (int i = 0; i < c; i++)
        {
            oot[i] = ip.stack.ElementAt(ip.stack.Count - c + i);
        }
        for (int i = c; i < snatchCount; i++)
        {
            oot[i] = def;
        }
        ip.Load();
        return oot;
    }

    public override string ToString()
    {
        return "[Function]";
    }

    public override VarFunction Clone()
    {
        return new VarFunction(this.action);
    }
    public override bool Truthy() { return true; }
}