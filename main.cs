using System;

class Program
{
    public static void Main(string[] args)
    {
        Strings.ParseDictionary();
        //new Constants();
        Console.WriteLine("--Instructions--");
        Instruction.DoRegistrations();
        var interp = new Interpreter();
        interp.byteCode = Interpreter.Assemble(@"
; 0-9
    ten
    range

join ; Implicitly join by ,

            ");
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