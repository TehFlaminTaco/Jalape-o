public class Constants
{
    [Register("number", 3, byteCount = 2)]
    public static void PushNumber(Interpreter ip, byte[] data)
    {
        if (data.Length == 0) ip.stack.Push(new VarNumber(0));
        else ip.stack.Push(new VarNumber(data[0]));
    }

    [Register("char", 4, byteCount = 2)]
    public static void PushChar(Interpreter ip, byte[] data)
    {
        if (data.Length == 0) ip.stack.Push(new VarList("\0"));
		else ip.stack.Push(new VarList(ShortUF8.ToRegularString(data)));
    }

    [Register("zero", 0)]
    public static void PushZero(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(0));
    }
    [Register("one", 1)]
    public static void PushOne(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(1));
    }
    [Register("two", 2)]
    public static void PushTwo(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(2));
    }
    [Register("ten", 10)]
    public static void PushTen(Interpreter ip)
    {
        ip.stack.Push(new VarNumber(10));
    }
    [Register("alphabet", 5)]
    public static void PushAlphabet(Interpreter ip)
    {
        ip.stack.Push(new VarList("abcdefghijklmnopqrstuvwxyz"));
    }
    [Register("alldigits", 6)]
    public static void PushDigits(Interpreter ip)
    {
        ip.stack.Push(new VarList("0123456789"));
    }
    [Register("noop", 8)]
    public static void PushNoop(Interpreter ip)
    {
        ip.stack.Push(new VarFunction(ip => { }));
    }
}