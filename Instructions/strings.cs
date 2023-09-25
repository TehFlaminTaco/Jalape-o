using System;
using System.Linq;
using System.Collections.Generic;

public static class Strings
{
    [Register("tostring", 0x70)]
    public static void VarToString(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(new VarList(ip.stack.Pop().ToString()));
        });
    }

    private const byte CONTINUE = 0b1000_0000;
    private const byte BACKREF = 0b0100_0000;
    private const byte RUNLEN = 0b0010_0000;
    private const byte BACKREFLEN = 0b0011_1111;
    private const byte RUNCOUNT = 0b0001_1111;
    public static string Decompress(byte[] c)
    {
        int ptr = 0;
        List<byte> o = new();
        while (ptr < c.Length)
        {
            byte b = c[ptr++];
            bool DoContinue = (b & CONTINUE) > 0;
            bool BackRef = (b & BACKREF) > 0;
            bool RunLen = (b & RUNLEN) > 0;
            byte RunCount = (byte)(b & RUNCOUNT);

            if (BackRef)
            {
                byte len = (byte)((b & BACKREFLEN) + 3);
                byte dist = (byte)(c[ptr++] + 1);
                if (o.Count - (dist + 1) < 0)
                {
                    throw new Exception($"{ShortUF8.ToRegularString(o.ToArray())}\nDecompression out of bounds! MAX: {o.Count} GOT: {dist + 1} AT: {ptr}");
                }
                for (int i = 0; i < len; i++)
                {
                    o.Add(o[o.Count - (dist + 1)]);
                }
            }
            else
            {
                if (RunLen)
                {
                    byte CH = c[ptr++];
                    for (int i = 0; i < (RunCount + 3); i++) o.Add(CH);
                }
                else
                {
                    for (int i = 0; i < (RunCount + 1); i++) o.Add(c[ptr++]);
                }
            }

            if (!DoContinue) break;
        }
        return ShortUF8.ToRegularString(o.ToArray());
    }

    public static int GetDecompressLength(int index, byte[] c, bool dictionaryMode)
    {
        int ptr = index;
        while (ptr < c.Length)
        {
            byte b = c[ptr++];
            bool DoContinue = (b & CONTINUE) > 0;
            bool BackRef = (b & BACKREF) > 0;
            bool RunLen = (b & RUNLEN) > 0;
            byte RunCount = (byte)(b & RUNCOUNT);

            if (BackRef || RunLen)
            {
                ptr++;
            }
            else
            {
                ptr += RunCount + 1;
            }

            if (!DoContinue) break;
        }
        return ptr - index;
    }

    public static byte[] Compress(string S)
    {
        byte[] b = ShortUF8.ToShortBytes(S);
        int ptr = 0;
        List<byte> o = new();
        o.Add(Instruction.Names["string"]);
        List<byte> charBuffer = new();
        while (ptr < b.Length)
        {
            // Check for potential backreferences.
            (int target, int length)? backRef = null;
            if (ptr > 0)
            {
                List<(int target, int length)> backReferneces = new();
                for (int i = Math.Max(0, ptr - 256); i <= ptr - 1; i++)
                {
                    int p = ptr;
                    int I = i;
                    int l = 0;
                    while (p < b.Length && b[I++] == b[p++] && l <= BACKREFLEN + 3) l++;
                    if (l > 2) backReferneces.Add((i, l));
                }

                if (backReferneces.Count > 0) backRef = backReferneces.MaxBy(c => c.length);
            }

            byte CH = b[ptr];
            int runLength = 0;
            // Check for potential runlengths
            {
                int p = ptr;
                while (p < b.Length && b[p++] == CH && runLength <= RUNLEN + 3) runLength++;
            }

            if (backRef is not null && backRef.Value.length > runLength)
            {
                if (charBuffer.Count > 0)
                {
                    o.Add((byte)(CONTINUE | (charBuffer.Count - 1)));
                    o.AddRange(charBuffer);
                    charBuffer = new();
                }
                (int brTarg, int brLen) = backRef.Value;
                byte dc = (byte)((ptr + brLen) < b.Length ? CONTINUE : 0);
                o.Add((byte)(dc | BACKREF | (brLen - 3)));
                o.Add((byte)((ptr - brTarg) - 2));
                ptr += brLen;
            }
            else if (runLength > 2)
            {
                if (charBuffer.Count > 0)
                {
                    o.Add((byte)(CONTINUE | (charBuffer.Count - 1)));
                    o.AddRange(charBuffer);
                    charBuffer = new();
                }
                byte dc = (byte)((ptr + runLength) < b.Length ? CONTINUE : 0);
                o.Add((byte)(dc | RUNLEN | (runLength - 3)));
                o.Add((byte)(CH));
                ptr += runLength;
            }
            else
            {
                charBuffer.Add(b[ptr++]);
                if (charBuffer.Count > RUNCOUNT)
                {
                    byte dc = (byte)(ptr < b.Length ? CONTINUE : 0);
                    o.Add((byte)(dc | (charBuffer.Count - 1)));
                    o.AddRange(charBuffer);
                    charBuffer = new();
                }
            }
        }

        if (charBuffer.Count > 0)
        {
            o.Add((byte)(charBuffer.Count - 1));
            o.AddRange(charBuffer);
            charBuffer = new();
        }

        return o.ToArray();
    }

    public static VarList VarToDigits(Var v, int bse = 10)
    {
        if (v is VarList vl)
        {
            VarList o = new();
            for (var i = 0; i < vl.data.Count; i++)
            {
                o.data.Add(VarToDigits(vl.data[i]));
            }
            return o;
        }
        if (v is VarNumber vn)
        {
            if (vn.data == 0) return new VarList("0");
            VarList o = new();
            decimal n = vn.data;
            while (n >= 1)
            {
                o.data.Insert(0, new VarNumber((decimal)MathF.Floor((float)(n % bse))));
                n /= bse;
            }
            return o;
        }
        return new VarList();
    }

    [Register("digits", 0x71)]
    public static void Digits(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            ip.stack.Push(VarToDigits(ip.stack.Pop()));
        });
    }

    [Register("tobase", 0x72)]
    public static void ToBase(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            Var b;
            if (ip.stack.Count == 0)
            {
                b = new VarNumber(2);
            }
            else
            {
                b = ip.stack.Pop();
            }
            ip.stack.Push(Var.WithNumbers(a, b, (an, bn) => VarToDigits(an, (int)bn.data), new VarList()));
        });
    }

    [Register("join", 0x73)]
    public static void Join(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Var a = ip.stack.Pop();
            Var deliminator;
            if (a is not VarList)
            {
                if (ip.stack.Count > 0 && ip.stack.Peek() is VarList)
                {
                    deliminator = a;
                    a = ip.stack.Pop();
                }
                else
                {
                    a = JStack.VarToRange(a);
                    if (ip.stack.Count > 0) deliminator = ip.stack.Pop();
                    else deliminator = new VarList(",");
                }
            }
            else
            {
                if (ip.stack.Count > 0) deliminator = ip.stack.Pop();
                else deliminator = new VarList(",");
            }
            if (deliminator is not VarList l) deliminator = new VarList("" + deliminator);
            VarList o = new();
            VarList al = a as VarList;
            VarList dl = deliminator as VarList;
            string ds = dl.ToString();
            for (var i = 0; i < al.data.Count; i++)
            {
                if (i > 0)
                {
                    foreach (var c in ShortUF8.ToShortBytes(ds))
                    {
                        o.data.Add(new VarNumber(c));
                    }
                }
                foreach (var c in ShortUF8.ToShortBytes(al.data[i].ToString()))
                {
                    o.data.Add(new VarNumber(c));
                }
            }
            ip.stack.Push(o);
        });
    }

    [Register("print", 0x74)]
    public static void Print(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Console.WriteLine(ip.stack.Pop());
        });
    }
    [Register("write", 0x75)]
    public static void Write(Interpreter ip)
    {
        Curry.Expect(ip, 1, ip =>
        {
            Console.Write(ip.stack.Pop());
        });
    }

    [Register("string", 7, stringTaker = 1)]
    public static void DictString(Interpreter ip, byte[] data)
    {
        ip.stack.Push(new VarList(Decompress(data)));
    }
}