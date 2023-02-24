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
            .Select(c => (c, c.GetCustomAttributes(typeof(RegisterAttribute), false).OfType<RegisterAttribute>().FirstOrDefault()))
            .Where(c => c.Item2 is not null);
        if (registrations.Count() == 0)
        {
            throw new Exception("No commands!");
        }
        foreach (var (method, attr) in registrations)
        {
            Names[attr.name.ToLower()] = i;
            Console.WriteLine($"{attr.name}: {i}");
            ByCode[i++] = (method, attr);
        }
    }
}