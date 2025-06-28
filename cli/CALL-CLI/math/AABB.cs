namespace CALL_CLI.math;

public class Aabb3(Vec3 a, Vec3 b)
{
    public Vec3 A = a;
    public Vec3 B = b;

    public bool InBound(Vec3f v)
    {
        return v.X >= A.X && v.X <= B.X &&
               v.Y >= A.Y && v.Y <= B.Y &&
               v.Z >= A.Z && v.Z <= B.Z;
    }
}

public class Aabb2(Vec2 a, Vec2 b)
{
    public Vec2 A = a;
    public Vec2 B = b;

    public bool InBound(Vec2f v)
    {
        return v.X >= A.X && v.X <= B.X &&
               v.Y >= A.Y && v.Y <= B.Y;
    }
}