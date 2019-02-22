class BattleController extends BaseController {

	private _battleView: BattleView;
	private _battleModel: BattleModel;
	private _battleProxy: BattleProxy;

	public constructor() {
		super();
		let self = this;

		self._battleView = new BattleView(self, LayerMgr.GAME_MAP_LAYER);
		App.View.register(ViewConst.Battle, self._battleView);

		self._battleModel = new BattleModel(self);
		self.setModel(self._battleModel);

		self._battleProxy = new BattleProxy(self);

		//注册模块消息
		self.registerFunc(BattleConst.BATTLE_INIT, self.onBattleInit, self);
	}

	private onBattleInit(): void {
		let self = this;
		if (App.View.isShow(ViewConst.Battle)) return;
		self._battleModel.levelVO = GlobleData.getData(GlobleData.LevelVO, self._battleModel.currMission);
		self._battleModel.maxBaseCount = Number(GlobleData.getDataByFilter(GlobleData.ServerConfigVO, "id", "MAX_OPEN_COUNT")[0].value);
		App.View.open(ViewConst.Battle, () => {
			App.Timer.doFrame(0, 0, self.onBattleUpdate, self);
			self.initRegisterView();
		});
	}

	/** 更新战斗中的数据信息	比如：怪物的生产、移动等 */
	private onBattleUpdate(): void {
		
	}

	/** 添加角色在地图上 */
	public pushRoleToMap(roleId: number, baseItem: BaseItem): void {
		let self = this;
		let role: Role = ObjectPool.pop(Role, "Role", self, LayerMgr.GAME_MAP_LAYER);
		role.isGuard = false;
		role.addToParent();
		role.open(roleId);
		role.isDrop = false;
		baseItem.state = BASE_STATE.HAVE;
		role.baseItem = baseItem;
		role.baseItem.setLevel(roleId + 1);
		let pos: egret.Point = baseItem.localToGlobal();
		let roleX: number = pos.x + (baseItem.width / 2) - (role.roleImg.width / 2);
		let roleY: number = pos.y + 20;
		role.setPosition(roleX, roleY);
		self._battleModel.roleDic.Add(baseItem, role);
	}

	/** 获取购买英雄的价格 */
	public getHeroBuyGold(heroId: number): number {
		let heroVO: HeroVO = GlobleData.getData(GlobleData.HeroVO, heroId);
		if (heroVO) return heroVO.gold;
		return -1;
	}

	/** 查找一样的英雄 */
	public findSameHero(heroId: number = -1): void {
		let len: number = this._battleModel.roleDic.GetLenght();
		if (len > 0) {
			for (let i: number = 0; i < len; i++) {
				let role: Role = this._battleModel.roleDic.getValueByIndex(i);
				if (role && !role.isGuard) {
					if (heroId != -1 && role.heroVO.heroId != heroId) {
						role.alpha = 0.3;
					} else {
						role.alpha = 1;
					}
				}
			}
		}
	}

	/** 注册界面才可以打开界面 */
	private initRegisterView(): void {
		let self = this;
	}

}