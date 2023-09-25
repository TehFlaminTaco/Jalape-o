using System;
using System.Linq;
using System.Collections.Generic;
using System.Reflection;

[System.AttributeUsage(System.AttributeTargets.Method)]
public class RegisterAttribute : System.Attribute
{
    public string name;
    public int byteCount = 1;
    public string terminator = "";
    public bool takeFunctions = false;
    public int stringTaker = 0;
    public byte setByte;
    public RegisterAttribute(string name, byte setByte)
    {
        this.name = name;
        this.setByte = setByte;
    }
}

[System.AttributeUsage(System.AttributeTargets.Method)]
public class AliasAttribute : System.Attribute
{
    public string name;
    public AliasAttribute(string name)
    {
        this.name = name;
    }
}

public class Instruction
{
    public static (MethodInfo, RegisterAttribute)[] ByCode = new (MethodInfo, RegisterAttribute)[256];
    public static Dictionary<string, byte> Names = new();

    public static void DoRegistrations()
    {
        HashSet<byte> takenBytes = new();
        var registrations = System.Reflection.Assembly
            .GetExecutingAssembly().GetTypes()
            .SelectMany(c => c.GetMethods())
            .Select(c => (c, c.GetCustomAttributes<RegisterAttribute>(false).FirstOrDefault()))
            .Where(c => c.Item2 is not null);
        if (registrations.Count() == 0)
        {
            throw new Exception("No commands!");
        }
        foreach (var (method, attr) in registrations)
        {
            if (takenBytes.Contains(attr.setByte))
            {
                throw new ArgumentException($"Unexpected collision for 0x{attr.setByte:X} between {ByCode[attr.setByte]} and {method}");
            }
            takenBytes.Add(attr.setByte);
            string name = attr.name;
            if (Names.ContainsKey(attr.name.ToLower()))
            {
                throw new ArgumentException($"Unexpected collision for '{attr.name}' between {ByCode[Names[attr.name.ToLower()]].Item1} and {method}");
            }
            Names[attr.name.ToLower()] = attr.setByte;
            foreach (var a in method.GetCustomAttributes<AliasAttribute>(false))
            {
                name += "/" + a.name;
                if (Names.ContainsKey(a.name.ToLower()))
                {
                    throw new ArgumentException($"Unexpected collision for '{a.name}' between {ByCode[Names[a.name.ToLower()]].Item1} and {method}");
                }
                Names[a.name.ToLower()] = attr.setByte;
            }
            Jalapeno.WriteDebug($"{name}:{new String(' ', 24 - name.Length)}{BitConverter.ToString(new byte[] { attr.setByte })}");
            ByCode[attr.setByte] = (method, attr);
        }
    }
}