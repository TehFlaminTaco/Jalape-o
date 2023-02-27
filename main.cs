using System.Text;
using System.IO;
using System;
using System.Collections.Generic;

class Program
{
    public static void Main(string[] args)
    {
        List<string> textArgs = new();
        Dictionary<char, string> flags = new();
        for (var i = 0; i < args.Length; i++){
            if(args[i].StartsWith('-')){
                if(args[i].Length == 1)continue;
                flags[args[i][1]] = args[i][2..];
            }else{
                textArgs.Add(args[i]);
            }
        }
        if(textArgs.Count == 0){
            Console.WriteLine(@"Usage: jalapeno <file> [Options...]");
            return;
        }

        var targetFile = textArgs[0];
        if(Path.GetExtension(targetFile) == "jna") flags['a'] = "";
        byte[] code = File.ReadAllBytes(targetFile);


        Strings.ParseDictionary();
        //new Constants();
        Console.WriteLine("--Instructions--");
        Instruction.DoRegistrations();
        var interp = new Interpreter
        {
            byteCode = flags.ContainsKey('a') ? Interpreter.Assemble(Encoding.UTF8.GetString(code)) : code
        };
        Console.WriteLine("--Assembled--");
        Console.WriteLine(BitConverter.ToString(interp.byteCode).Replace('-', ' '));
        Console.WriteLine("--Output--");
        try { interp.Execute(interp.Parse()); }
        catch (Exception e)
        {
            Console.WriteLine("-- ERROR --");
            Console.WriteLine(e);
            Console.WriteLine("-- STACK --");
            Console.WriteLine(String.Join(", ", interp.stack));
            return;
        }
        while (interp.stack.Count > 0)
        {
            Console.WriteLine(interp.stack.Pop());
        }
    }
}