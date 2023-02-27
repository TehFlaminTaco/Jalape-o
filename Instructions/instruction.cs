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
    public RegisterAttribute(string name)
    {
        this.name = name;
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
        byte i = 0;
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
            string name = attr.name;
            Names[attr.name.ToLower()] = i;
            foreach (var a in method.GetCustomAttributes<AliasAttribute>(false))
            {
                name += "/" + a.name;
                Names[a.name.ToLower()] = i;
            }
            Console.WriteLine($"{name}:{new String(' ', 24 - name.Length)}{BitConverter.ToString(new byte[] { i })}");
            ByCode[i++] = (method, attr);
        }
    }
}