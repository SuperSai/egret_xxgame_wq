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
var BattleController = (function (_super) {
    __extends(BattleController, _super);
    function BattleController() {
        var _this = _super.call(this) || this;
        var self = _this;
        self._battleView = new BattleView(self, LayerMgr.GAME_MAP_LAYER);
        App.View.register(ViewConst.Battle, self._battleView);
        self._battleModel = new BattleModel(self);
        self.setModel(self._battleModel);
        self._battleProxy = new BattleProxy(self);
        //注册模块消息
        self.registerFunc(BattleConst.BATTLE_INIT, self.onBattleInit, self);
        return _this;
    }
    BattleController.prototype.onBattleInit = function () {
        var self = this;
        if (App.View.isShow(ViewConst.Battle))
            return;
        self._battleModel.levelVO = GlobleData.getData(GlobleData.LevelVO, self._battleModel.currMission);
        self._battleModel.maxBaseCount = Number(GlobleData.getDataByFilter(GlobleData.ServerConfigVO, "id", "MAX_OPEN_COUNT")[0].value);
        App.View.open(ViewConst.Battle, function () {
            App.Timer.doFrame(0, 0, self.onBattleUpdate, self);
            self.initRegisterView();
        });
    };
    /** 更新战斗中的数据信息	比如：怪物的生产、移动等 */
    BattleController.prototype.onBattleUpdate = function () {
    };
    /** 添加角色在地图上 */
    BattleController.prototype.pushRoleToMap = function (roleId, baseItem) {
        var self = this;
        var role = ObjectPool.pop(Role, "Role", self, LayerMgr.GAME_MAP_LAYER);
        role.isGuard = false;
        role.addToParent();
        role.open(roleId);
        role.isDrop = false;
        baseItem.state = BASE_STATE.HAVE;
        role.baseItem = baseItem;
        role.baseItem.setLevel(roleId + 1);
        var pos = baseItem.localToGlobal();
        var roleX = pos.x + (baseItem.width / 2) - (role.roleImg.width / 2);
        var roleY = pos.y + 20;
        role.setPosition(roleX, roleY);
        self._battleModel.roleDic.Add(baseItem, role);
    };
    /** 获取购买英雄的价格 */
    BattleController.prototype.getHeroBuyGold = function (heroId) {
        var heroVO = GlobleData.getData(GlobleData.HeroVO, heroId);
        if (heroVO)
            return heroVO.gold;
        return -1;
    };
    /** 查找一样的英雄 */
    BattleController.prototype.findSameHero = function (heroId) {
        if (heroId === void 0) { heroId = -1; }
        var len = this._battleModel.roleDic.GetLenght();
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var role = this._battleModel.roleDic.getValueByIndex(i);
                if (role && !role.isGuard) {
                    if (heroId != -1 && role.heroVO.heroId != heroId) {
                        role.alpha = 0.3;
                    }
                    else {
                        role.alpha = 1;
                    }
                }
            }
        }
    };
    /** 注册界面才可以打开界面 */
    BattleController.prototype.initRegisterView = function () {
        var self = this;
    };
    return BattleController;
}(BaseController));
__reflect(BattleController.prototype, "BattleController");
//# sourceMappingURL=BattleController.js.map