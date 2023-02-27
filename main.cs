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
save
    push 8
    push 2
    push 1 reverse
    push 7
    push 3
    push 1
    push 5
    push 4
makelist

; Digits > 0
aspair
    zero lt
where

; In order
sort

; A list of numbers 1 - l of the same length
copy length range one add
makelist transpose ; Into pairs
aspair
    unpack eq
takewhile ; All the pairs that are equal
length one add
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