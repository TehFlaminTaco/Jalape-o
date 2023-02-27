public class Constants
{
    [Register("push", byteCount = 2)]
    public static void PushNumber(Interpreter ip, byte[] data)
    {
        if (data.Length == 0) ip.stack.Push(new VarNumber(0));
        else ip.stack.Push(new VarNumber(data[0]));
    }

    [Register("zero")]
    public static void PushZero(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(0));
    }
    [Register("one")]
    public static void PushOne(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(1));
    }
    [Register("two")]
    public static void PushTwo(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(2));
    }
    [Register("ten")]
    public static void PushTen(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(10));
    }
    [Register("alphabet")]
    public static void PushAlphabet(Interpreter ip)
    {
        ip.stack.Push(new VarList("abcdefghijklmnopqrstuvwxyz"));
    }
    [Register("digits")]
    public static void PushDigits(Interpreter ip)
    {
        ip.stack.Push(new VarList("0123456789"));
    }
}