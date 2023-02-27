using System.Text;
using System.Linq;

public class ShortUF8
{
    private static string toUTF = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + // Base36 characters
                                  " !\"#$%^'()*+,-./:;<=>?@[\\]^_`{|}~" + // Symbols
                                  "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\x0C\x0D\x0E\x0F" +  // Control chars
                                  "\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\x7F";
    public static string ToRegularString(byte[] buffer)
    {
        string s = Encoding.UTF8.GetString(buffer);
        string o = "";
        foreach (char c in s)
        {
            if (c < 128)
            {
                o += toUTF[c];
            }
            else
            {
                o += c;
            }
        }
        return o;
    }
    public static byte[] ToShortBytes(string s)
    {
        string o = "";
        foreach (char c in s)
        {
            if (c < 128)
            {
                o += (char)System.Array.FindIndex(toUTF.ToCharArray(), C => C == c);
            }
            else
            {
                o += c;
            }
        }
        return Encoding.UTF8.GetBytes(o);
    }
}