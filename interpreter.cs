using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class Interpreter
{
    public int IP = 0;
    public Stack<Var> stack = new();
    public Stack<Stack<Var>> stackStack = new();
    public Dictionary<string, Var> reg = new();
    public byte[] byteCode;

    private static readonly Regex Comments = new Regex(@";.*", RegexOptions.Multiline);
    private static readonly Regex Instructions = new Regex(@"(?<number>
  (?:-?0x[0-9a-fA-F]+)|
  (?:-?0b[01]+)|
  (?:-?0o[0-7]+)|
  (?:-?\d+(?:e\d+)?)
)|(?<instruction>
  \w+
)", RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace);
    public static byte[] Assemble(string s)
    {
        List<byte> byteCode = new();
        s = Comments.Replace(s, "");
        foreach (Match m in Instructions.Matches(s))
        {
            if (m.Groups.ContainsKey("instruction") && !string.IsNullOrWhiteSpace(m.Groups["instruction"].Value))
            {
                byteCode.Add(Instruction.Names[m.Groups["instruction"].Value.ToLower()]);
            }
            else
            {
                byteCode.Add(byte.Parse(m.Groups["number"].Value));
            }
        }

        return byteCode.ToArray();

    }

    public List<VarFunction> Parse()
    {
        List<VarFunction> o = new();
        while (IP < byteCode.Length) o.Add(TakeFunction());
        return o;
    }

    public void Execute(List<VarFunction> methods)
    {
        for (var i = 0; i < methods.Count; i++)
        {
            methods[i].Call(this);
        }
    }

    public VarFunction TakeFunction()
    {
        return TakeFunction(byteCode, ref IP);
    }

    static public VarFunction TakeFunction(byte[] code, ref int ip)
    {
        var next = code[ip++];
        var (method, attr) = Instruction.ByCode[next];
        if (method is null)
        {
            throw new Exception($"No method for code: {next}");
        }
        int count = attr.byteCount - 1;
        if (!string.IsNullOrWhiteSpace(attr.terminator))
        {
            byte terminator = Instruction.Names[attr.terminator.ToLower()];
            int start = ip;
            if (attr.takeFunctions)
            {
                while (code[ip] != terminator)
                {
                    TakeFunction(code, ref ip);
                }
                count = ip - start;
            }
            else
            {
                while (code[ip++] != terminator) count++;
            }
            ip = start;
        }
        else
        {
            int start = ip;
            if (attr.takeFunctions)
            {
                for (int i = 0; i < attr.byteCount; i++)
                {
                    TakeFunction(code, ref ip);
                }
                count = ip - start;
            }
            ip = start;
        }
        var data = new byte[count];
        for (var i = 0; i < count; i++)
        {
            data[i] = code[ip++];
        }
        return new VarFunction(interp =>
        {
            var c = method.GetParameters().Length;
            if (c == 0)
                method.Invoke(null, new object[] { });
            else if (c == 1)
                method.Invoke(null, new object[] { interp });
            else
                method.Invoke(null, new object[] { interp, data });
        });
    }

    public void Save()
    {
        this.stackStack.Push(this.stack);
        this.stack = new();
    }

    public void Load()
    {
        if (this.stackStack.Count == 0)
        {
            this.stack = new();
            return;
        }
        this.stack = this.stackStack.Pop();
    }
}