namespace CALL_CLI.math;

public class Vec3(int x, int y, int z)
{
    public int X = x;
    public int Y = y;
    public int Z = z;

    public Vec3 Set(int x, int y, int z)
    {
        this.X = x;
        this.Y = y;
        this.Z = z;
        return this;
    }
    
    public int Volume => (int)X * Y * Z;
    
    public override string ToString()
    {
        return $"({X}, {Y}, {Z})";
    }
}

public class Vec3f(float x, float y, float z)
{
    public float X = x;
    public float Y = y;
    public float Z = z;

    public Vec3f Set(float x, float y, float z)
    {
        this.X = x;
        this.Y = y;
        this.Z = z;
        return this;
    }
}