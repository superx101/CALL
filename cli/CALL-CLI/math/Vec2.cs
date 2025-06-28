namespace CALL_CLI.math;

public class Vec2(int x, int y)
{
    public int X = x;
    public int Y = y;

    public static Vec2 operator +(Vec2 a, Vec2 b)
    {
        return new Vec2(a.X + b.X, a.Y + b.Y);
    }

    public static Vec2 operator -(Vec2 a, Vec2 b)
    {
        return new Vec2(a.X - b.X, a.Y - b.Y);
    }
    
    public Vec2 Set(int x, int y)
    {
        this.X = x;
        this.Y = y;
        return this;
    }
}

public class Vec2f(double x, double y)
{
    public double X = x;
    public double Y = y;

    public static Vec2f operator +(Vec2f a, Vec2f b)
    {
        return new Vec2f(a.X + b.X, a.Y + b.Y);
    }

    public static Vec2f operator -(Vec2f a, Vec2f b)
    {
        return new Vec2f(a.X - b.X, a.Y - b.Y);
    }
    
    public Vec2f Set(double x, double y)
    {
        this.X = x;
        this.Y = y;
        return this;
    }
}