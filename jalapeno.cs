using System.Text;
using System.IO;
using System;
using System.Linq;
using System.Collections.Generic;

class Jalapeno
{
    public static bool debugPrint = false;
	public static bool golfPrint = false;
    public static void Main(string[] args)
    {
        List<string> textArgs = new();
        Dictionary<char, string> flags = new();
        for (var i = 0; i < args.Length; i++)
        {
            if (args[i].StartsWith('/'))
            {
                if (args[i].Length == 1) continue;
                flags[args[i][1]] = args[i][2..];
            }
            else
            {
                textArgs.Add(args[i]);
            }
        }
        if (textArgs.Count == 0)
        {
            Console.WriteLine(@"Usage: jalapeno <file> [Arguments...] [/Options...]");
            return;
        }

        if (flags.ContainsKey('d')) debugPrint = true;
		if (flags.ContainsKey('g')) golfPrint = true;
        var targetFile = textArgs[0];
        List<Var> passedArgs = textArgs.Skip(1).Select(c => Var.FromInput(c)).ToList();
        if (Path.GetExtension(targetFile) == ".jna") flags['a'] = "";
        byte[] code = File.ReadAllBytes(targetFile);
		byte[] raw = code;
        //new Constants();
        WriteDebug("--Instructions--");
        Instruction.DoRegistrations();
        if (flags.ContainsKey('a')) code = Interpreter.Assemble(Encoding.UTF8.GetString(code));
        if (flags.ContainsKey('o')) File.WriteAllBytes(flags['o'], code);
        if (flags.ContainsKey('R')) return;
        var interp = new Interpreter
        {
            byteCode = code
        };
        interp.stackStack.Push(new Stack<Var>(passedArgs));
		WriteGolf($"[Jalapeño](https://github.com/TehFlaminTaco/Jalape-o), {interp.byteCode.Length} bytes");
        WriteDebug($"--Assembled ({interp.byteCode.Length} bytes)--");
		var byteString = BitConverter.ToString(interp.byteCode).Replace('-', ' ');
		WriteGolf($"    {byteString}\n");
		WriteGolf($"## Assembly");
		WriteGolf("    " + Encoding.UTF8.GetString(raw).Replace("\n", "\n    ") + "\n");
        WriteDebug(byteString);
        WriteDebug("--Output--");
		WriteGolf($"## Output\n```");
        try { interp.Execute(interp.Parse()); }
        catch (Exception e)
        {
            Console.Error.WriteLine("-- ERROR --");
            Console.Error.WriteLine(e);
            Console.Error.WriteLine("-- STACK --");
            Console.Error.WriteLine(String.Join(", ", interp.stack));
            return;
        }
        if (interp.stack.Count == 1 && interp.stack.Peek() is VarFunction f)
        {
            interp.Save();
            interp.stack = new(passedArgs);
            f.Call(interp);
        }
        while (interp.stack.Count > 0)
        {
            if (interp.stack.Count == 1) Console.Write(interp.stack.Pop());
            else Console.WriteLine(interp.stack.Pop());
        }
		WriteGolf($"\n```");
    }

    public static void WriteDebug(string format, params object[] values)
    {
        if (debugPrint) Console.WriteLine(format, values);
    }

	public static void WriteGolf(string format, params object[] values){
		if (golfPrint) Console.WriteLine(format, values);
	}
	public static void WriteGolfNoline(string format, params object[] values){
		if (golfPrint) Console.Write(format, values);
	}
}