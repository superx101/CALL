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
}

public class Vec3f(double x, double y, double z)
{
    public double X = x;
    public double Y = y;
    public double Z = z;

    public Vec3f Set(double x, double y, double z)
    {
        this.X = x;
        this.Y = y;
        this.Z = z;
        return this;
    }
}