/**
 * 战斗界面
 */
class BattleView extends BaseEuiView {

	public map: BattleMap;	// 地图
	public btn_buyRole: eui.Group; // 购买角色按钮
	public btn_hall: eui.Button; // 返回大厅按钮
	public txt_money: eui.Label; // 角色价格
	public txt_level: eui.Label; // 当前关卡数
	public currency: CurrencyCom; // 货币组件
	private _buyHeroId: number;
	private _buyHeroGold: number;

	private _model: BattleModel;
	private systemLeaf: particle.ParticleSystem;

	public constructor($controller: BaseController, $layer: number) {
		super($controller, $layer);
		let self = this;
		self.skinName = SkinName.BattleViewSkin;
		self.setResources(["battle", "role"]);
	}

	/** 对面板进行显示初始化，用于子类继承 */
	public initUI(): void {
		super.initUI();
		let self = this;
		self.currency.initUI();
	}

	/** 对面板数据的初始化，用于子类继承 */
	public initData(): void {
		super.initData();
		this.refreshBuyHeroBtn();
		this._model = <BattleModel>this.controller.getModel();
		//初始化地图数据
		this.map.open(this.controller);
		App.Sound.playBg("10005");
	}

	public addEvents(): void {
		super.addEvents();
		let self = this;
		self.btn_buyRole.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onBuyRoleHandler, self);
		self.setBtnEffect(["btn_buyRole"]);
		self.controller.registerFunc(BattleConst.UPDATE_BUY_HERO, self.onUpdateBuyHeroView, self);
	}

	public removeEvents(): void {
		super.removeEvents();
		let self = this;
		self.btn_buyRole.removeEventListener(egret.TouchEvent.TOUCH_TAP, self.onBuyRoleHandler, self);
	}

	/** 购买角色 */
	private onBuyRoleHandler(): void {
		let self = this;
		if (App.Player.info.gold < this._buyHeroGold || this._buyHeroGold == -1) {
			App.Message.showText(App.Language.getLanguageText("label.01"));
			return;
		}
		self.applyFunc(BattleConst.CREATE_ROLE, self._buyHeroId);
	}

	private onUpdateBuyHeroView(): void {
		App.NotificationCenter.dispatch(CommonEvent.UPDATE_CURRENCY, -this._buyHeroGold, ITEM_TYPE.GOLD);
		this.refreshBuyHeroBtn();
	}

	/** 刷新英雄购买按钮 */
	private refreshBuyHeroBtn(): void {
		this._buyHeroId = App.Random.randrange(0, 3);
		this._buyHeroGold = (this.controller as BattleController).getHeroBuyGold(this._buyHeroId);
		this.txt_money.text = this._buyHeroGold + "";
	}

	private getCurrencyTarget(type: number): eui.Group {
		switch (type) {
			case ITEM_TYPE.GOLD:
				return this.currency.goldGroup;
			case ITEM_TYPE.DIAMOND:
				return this.currency.diamondGroup;
		}
	}

}