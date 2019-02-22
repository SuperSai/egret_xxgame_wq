var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var BattleModel = (function (_super) {
    __extends(BattleModel, _super);
    function BattleModel($controller) {
        var _this = _super.call(this, $controller) || this;
        /** 当前的关卡等级 */
        _this.currMission = 1;
        /** 当前游戏中最高级的角色ID */
        _this.maxRoleId = 0;
        /** 一排的底座数量 */
        _this.hBaseItemCount = 5;
        /** 最大的底座数量 */
        _this.maxBaseCount = 0;
        /** 底座的高度 */
        _this.baseH = 100;
        var self = _this;
        self.init();
        return _this;
    }
    /** 初始化 */
    BattleModel.prototype.init = function () {
        var self = this;
        self._roleDic = new TSDictionary();
    };
    Object.defineProperty(BattleModel.prototype, "allBaseState", {
        /** 获取所有底座的状态 */
        get: function () {
            var self = this;
            var lists = [];
            for (var i = self.maxBaseCount; i > 0; i--) {
                if (i > self._levelVO.openBaseCount) {
                    lists.push(BASE_STATE.CLOSE);
                }
                else {
                    lists.push(BASE_STATE.OPEN);
                }
            }
            return lists;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BattleModel.prototype, "levelVO", {
        /** 关卡表模板数据 */
        get: function () {
            return this._levelVO;
        },
        set: function (value) {
            this._levelVO = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BattleModel.prototype, "roleDic", {
        /** 出战的角色字典 */
        get: function () {
            return this._roleDic;
        },
        set: function (value) {
            this._roleDic = value;
        },
        enumerable: true,
        configurable: true
    });
    return BattleModel;
}(BaseModel));
__reflect(BattleModel.prototype, "BattleModel");
/** 底座的状态 */
var BASE_STATE;
(function (BASE_STATE) {
    /** 关闭状态 */
    BASE_STATE[BASE_STATE["CLOSE"] = 0] = "CLOSE";
    /** 开启状态 */
    BASE_STATE[BASE_STATE["OPEN"] = 1] = "OPEN";
    /** 拥有角色状态 */
    BASE_STATE[BASE_STATE["HAVE"] = 2] = "HAVE";
})(BASE_STATE || (BASE_STATE = {}));
//# sourceMappingURL=BattleModel.js.map