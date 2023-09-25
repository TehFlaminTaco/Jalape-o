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

    private static readonly Regex TokenRegex = new Regex(@"(?<Comment>//.*)|
(?<MultilineComment>/\*(.|\s)*\*/)|
(?<Number>\d+)|
(?<String>\x22(?<StringBody>(?:\\.|[^\x22\n])*)\x22)|
(?<Char>'(?<CharBody>\\.|.)')|
(?<Word>\w+)|
(?<Punctuation>[-!$%^&*()_+|~=`{}\[\]:;<>?,.\/])", RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace);
    public static byte[] Assemble(string s)
    {
        MatchCollection tokens = TokenRegex.Matches(s);
        List<byte> byteCode = new();

        Stack<List<byte>> functionStack = new();
        List<byte> currentFunction = new();

        foreach (Match m in tokens)
        {
            if (m.Groups.ContainsKey("Number") && !String.IsNullOrWhiteSpace(m.Groups["Number"].Value))
            {
                var val = byte.Parse(m.Groups["Number"].Value);
                switch (val)
                {
                    case 0:
                        {
                            currentFunction.Add(Instruction.Names["zero"]);
                            break;
                        }
                    case 1:
                        {
                            currentFunction.Add(Instruction.Names["one"]);
                            break;
                        }
                    case 2:
                        {
                            currentFunction.Add(Instruction.Names["two"]);
                            break;
                        }
                    case 10:
                        {
                            currentFunction.Add(Instruction.Names["ten"]);
                            break;
                        }
                    default:
                        {
                            currentFunction.Add(Instruction.Names["number"]);
                            currentFunction.Add(val);
                            break;
                        }
                }
            }
            else if (m.Groups.ContainsKey("StringBody") && !String.IsNullOrWhiteSpace(m.Groups["StringBody"].Value))
            {
                string body = Regex.Unescape(m.Groups["StringBody"].Value);
                byte[] shortBytes;
                if (String.IsNullOrEmpty(body))
                {
                    currentFunction.Add(Instruction.Names["empty"]);
                }
                else if ((shortBytes = ShortUF8.ToShortBytes(body)).Length == 1)
                {
                    currentFunction.Add(Instruction.Names["char"]);
                    currentFunction.Add(shortBytes[0]);
                }
                else
                {
                    currentFunction.AddRange(Strings.Compress(body));
                }
            }
            else if (m.Groups.ContainsKey("CharBody") && !String.IsNullOrWhiteSpace(m.Groups["CharBody"].Value))
            {
                string body = Regex.Unescape(m.Groups["CharBody"].Value);
                var shortBytes = ShortUF8.ToShortBytes(body);
                var val = shortBytes[0];
                switch (val)
                {
                    case 0:
                        {
                            currentFunction.Add(Instruction.Names["zero"]);
                            break;
                        }
                    case 1:
                        {
                            currentFunction.Add(Instruction.Names["one"]);
                            break;
                        }
                    case 2:
                        {
                            currentFunction.Add(Instruction.Names["two"]);
                            break;
                        }
                    case 10:
                        {
                            currentFunction.Add(Instruction.Names["ten"]);
                            break;
                        }
                    default:
                        {
                            currentFunction.Add(Instruction.Names["number"]);
                            currentFunction.Add(val);
                            break;
                        }
                }
            }
            else if (m.Groups.ContainsKey("Word") && !String.IsNullOrWhiteSpace(m.Groups["Word"].Value))
            {
                currentFunction.Add(Instruction.Names[m.Groups["Word"].Value.ToLower()]);
            }
            else if (m.Groups.ContainsKey("Punctuation") && !String.IsNullOrWhiteSpace(m.Groups["Punctuation"].Value))
            {
                char symbol = m.Groups["Punctuation"].Value[0];
                switch (symbol)
                {
                    case '{':
                        {
                            functionStack.Push(currentFunction);
                            currentFunction = new();
                            break;
                        }
                    case '}':
                        {
                            var oldFunc = currentFunction;
                            currentFunction = functionStack.Pop();

                            var fncs = CountFunctions(oldFunc.ToArray());

                            switch (fncs)
                            {
                                case 0:
                                    {
                                        currentFunction.Add(Instruction.Names["noop"]);
                                        break;
                                    }
                                case 1:
                                    {
                                        currentFunction.Add(Instruction.Names["asfunc"]);
                                        currentFunction.AddRange(oldFunc);
                                        break;
                                    }
                                case 2:
                                    {
                                        currentFunction.Add(Instruction.Names["aspair"]);
                                        currentFunction.AddRange(oldFunc);
                                        break;
                                    }
                                case 3:
                                    {
                                        currentFunction.Add(Instruction.Names["astrio"]);
                                        currentFunction.AddRange(oldFunc);
                                        break;
                                    }
                                default:
                                    {
                                        currentFunction.Add(Instruction.Names["func"]);
                                        currentFunction.AddRange(oldFunc);
                                        currentFunction.Add(Instruction.Names["ret"]);
                                        break;
                                    }
                            }
                            break;
                        }
                    default:
                        {
                            currentFunction.Add(Instruction.Names[m.Groups["Punctuation"].Value.ToLower()]);
                            break;
                        }
                }
            }
        }
        while (functionStack.Count > 0)
        {
            var oldFunc = currentFunction;
            currentFunction = functionStack.Pop();

            var fncs = CountFunctions(oldFunc.ToArray());

            switch (fncs)
            {
                case 0:
                    {
                        currentFunction.Add(Instruction.Names["noop"]);
                        break;
                    }
                case 1:
                    {
                        currentFunction.Add(Instruction.Names["asfunc"]);
                        currentFunction.AddRange(oldFunc);
                        break;
                    }
                case 2:
                    {
                        currentFunction.Add(Instruction.Names["aspair"]);
                        currentFunction.AddRange(oldFunc);
                        break;
                    }
                case 3:
                    {
                        currentFunction.Add(Instruction.Names["astrio"]);
                        currentFunction.AddRange(oldFunc);
                        break;
                    }
                default:
                    {
                        currentFunction.Add(Instruction.Names["func"]);
                        currentFunction.AddRange(oldFunc);
                        currentFunction.Add(Instruction.Names["ret"]);
                        break;
                    }
            }
        }
        return currentFunction.ToArray();
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

    static public int CountFunctions(byte[] code)
    {
        int ip = 0;
        int res = 0;
        while (ip < code.Length)
        {
            var next = code[ip++];
            res++;
            var (method, attr) = Instruction.ByCode[next];
            if (method is null)
            {
                break;
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
            else if (attr.stringTaker != 0)
            {
                count = Strings.GetDecompressLength(ip, code, attr.stringTaker == 1);
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
        }
        return res;
    }

    static public VarFunction TakeFunction(byte[] code, ref int ip)
    {
        var next = code[ip++];
        var (method, attr) = Instruction.ByCode[next];
        if (method is null)
        {
            throw new Exception($"No method for code: {next:x}");
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
        else if (attr.stringTaker != 0)
        {
            count = Strings.GetDecompressLength(ip, code, attr.stringTaker == 1);
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