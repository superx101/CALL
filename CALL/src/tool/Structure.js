// const Constant = require("../global/Constant")
// const Pos3D = require("../tool/Pos3D")
// const Area3D = require("../tool/Area3D")

class Structure {
    constructor(area, name = "", isPublic = false) {
        this.area = new Area3D(area);
        this.name = name;
        this.isPublic = isPublic;
        let lens = this.area.getLens();
        this.xSize = Math.ceil(parseFloat(lens[0]) / parseFloat(Constant.STRUCTURE.MAX_LENGTH));
        this.zSize = Math.ceil(parseFloat(lens[2]) / parseFloat(Constant.STRUCTURE.MAX_LENGTH));
    }

    getAreas() {
        let areas = new Array();
        for (let i = 0; i < this.xSize; i++) {
            areas[i] = new Array(this.zSize);
        }
        let start = {};
        let end = {};
        let iz, ix;
        for (iz = 0; iz < this.zSize - 1; iz++) {
            start.z = this.area.start.z + iz * Constant.STRUCTURE.MAX_LENGTH;
            end.z = this.area.start.z + (iz + 1) * Constant.STRUCTURE.MAX_LENGTH - 1;
            for (ix = 0; ix < this.xSize - 1; ix++) {
                start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
                end.x = this.area.start.x + (ix + 1) * Constant.STRUCTURE.MAX_LENGTH - 1;
                areas[ix][iz] = new Area3D(new Pos3D(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3D(end.x, this.area.end.y, end.z, this.area.start.dimid));
            }
            start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
            end.x = this.area.end.x;
            areas[ix][iz] = new Area3D(new Pos3D(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3D(end.x, this.area.end.y, end.z, this.area.start.dimid));
        }
        //iz == this.zSize - 1
        start.z = this.area.start.z + iz * Constant.STRUCTURE.MAX_LENGTH;
        end.z = this.area.end.z;
        for (ix = 0; ix < this.xSize - 1; ix++) {
            start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
            end.x = this.area.start.x + (ix + 1) * Constant.STRUCTURE.MAX_LENGTH - 1;
            areas[ix][iz] = new Area3D(new Pos3D(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3D(end.x, this.area.end.y, end.z, this.area.start.dimid));
        }
        //last
        start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
        end.x = this.area.end.x;
        end.z = this.area.end.z;
        areas[this.xSize - 1][this.zSize - 1] = areas[ix][iz] = new Area3D(new Pos3D(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3D(end.x, this.area.end.y, end.z, this.area.start.dimid));

        return areas;
    }
};

module.exports = Structure;