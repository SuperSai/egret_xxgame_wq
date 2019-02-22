/**
 * 战斗地图
 */
class BattleMap extends BaseEuiView {

	private mapImg: eui.Image;
	private lists: eui.List;	// 所有底座列表
	private overImg: eui.Image;

	private _arrColl: eui.ArrayCollection;
	private _model: BattleModel;
	private _battleController: BattleController;
	/** 当前选择中的角色 */
	private _selectRole: Role;
	// 选中的底座上角色的原始X坐标
	private _oX: number;
	// 选中的底座上角色的原始Y坐标
	private _oY: number;

	public constructor($controller: BaseController, $layer: number) {
		super($controller, $layer);
		this.skinName = SkinName.BattleMapSkin;
	}

	/** 面板开启执行函数，用于子类继承 */
	public open(...param: any[]): void {
		super.open(param);
		let self = this;
		self._battleController = param[0];
		self._model = <BattleModel>self._battleController.getModel();
		self.init();
		self.initMap();
		self.addEvents();
		self.updateAllBaseItem();
	}
	/** 初始化 */
	private init(): void {
		let self = this;
		self._arrColl = new eui.ArrayCollection();
		self.lists.itemRenderer = BaseItem;
		self.lists.dataProvider = self._arrColl;
	}
	/** 初始化地图 */
	private initMap(): void {
		let self = this;
		let path: string = PathConfig.MapPath.replace("{0}", self._model.levelVO.icon + "");
		App.Display.addAsyncBitmapToImage(path, self.mapImg);
	}

	public addEvents(): void {
		super.addEvents();
		let self = this;
		self._battleController.registerFunc(BattleConst.CREATE_ROLE, self.onCreateRole, self);
		App.Stage.getStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
	}

	public removeEvents(): void {
		super.removeEvents();
		let self = this;
		App.Stage.getStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
	}

	/** 开放新的底座 */
	private onOpenNewBase(): void {
		let self = this;
		self._model.levelVO.openBaseCount += self._model.hBaseItemCount;
		if (self._model.levelVO.openBaseCount >= self._model.maxBaseCount) {
			self._model.levelVO.openBaseCount = self._model.maxBaseCount;
			self.doNeedUpdateBaseItem();
			return;
		}
		self.doNeedUpdateBaseItem();
	}

	/** 创建角色 */
	private onCreateRole(roleId: number): void {
		let self = this;
		if (roleId < 0) return Log.traceError("角色ID错误：" + roleId);
		let len: number = self._model.roleDic.GetLenght();
		if (len >= (self._model.levelVO.openBaseCount + 1)) return App.Message.showText(App.Language.getLanguageText("battle.txt.01"));
		while (len < (self._model.levelVO.openBaseCount + 1)) {
			//在可以放置的底座中随机一个
			let random: number = App.Random.randrange(self._model.maxBaseCount - self._model.levelVO.openBaseCount, self._model.maxBaseCount);
			let baseItem: BaseItem = self.lists.getChildAt(random) as BaseItem;
			if (!self._model.roleDic.ContainsKey(baseItem) && baseItem.state == BASE_STATE.OPEN) {
				self._battleController.pushRoleToMap(roleId, baseItem);
				break;
			}
		}
		self._battleController.applyFunc(BattleConst.UPDATE_BUY_HERO);
	}

	/** 更新所有底座数据 */
	private updateAllBaseItem(): void {
		let self = this;
		self._arrColl.replaceAll(self._model.allBaseState);
	}

	/** 处理需要更新的底座 */
	private doNeedUpdateBaseItem(): void {
		let self = this;
		let startI: number = self._model.maxBaseCount - self._model.levelVO.openBaseCount;
		let len: number = startI + self._model.hBaseItemCount;
		for (let i: number = startI; i < len; i++) {
			(self.lists.getChildAt(i) as BaseItem).state = BASE_STATE.OPEN;
		}
	}

	private onTouchBegin(evt: egret.TouchEvent): void {
		let self = this;
		if (!evt.target || !(evt.target instanceof BaseItem)) return;
		App.Stage.getStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
		App.Stage.getStage().addEventListener(egret.TouchEvent.TOUCH_MOVE, self.onTouchMove, self);
		App.Stage.getStage().once(egret.TouchEvent.TOUCH_END, self.onTouchEnd, self, true);
		self._selectRole = self._model.roleDic.TryGetValue(evt.target);
		self._selectRole.isDrop = true;
		self._oX = self._selectRole.x;
		self._oY = self._selectRole.y;
		self._selectRole.x = evt.stageX;
		self._selectRole.y = evt.stageY;
		//设置拿起来的角色层级一定是最高的
		let layer: DisplayLayer = App.Layer.getLayerByType(LayerMgr.GAME_MAP_LAYER);
		layer.setChildIndex(self._selectRole, layer.numChildren);
		self._selectRole.baseItem.levelGroup.visible = false;
		self._battleController.findSameHero(self._selectRole.heroVO.heroId);
	}

	private onTouchMove(evt: egret.TouchEvent): void {
		let self = this;
		self._selectRole.x = evt.stageX;
		self._selectRole.y = evt.stageY;
	}

	private onTouchEnd(evt: egret.TouchEvent): void {
		let self = this;
		App.Stage.getStage().removeEventListener(egret.TouchEvent.TOUCH_MOVE, self.onTouchMove, self);
		App.Stage.getStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
		let baseItem: BaseItem = evt.target;
		if (!self._selectRole) return;
		self._selectRole.isDrop = false;
		if (!(evt.target instanceof BaseItem) || !baseItem || baseItem.state == BASE_STATE.CLOSE || baseItem.hashCode == self._selectRole.baseItem.hashCode) {
			self._selectRole.x = self._oX;
			self._selectRole.y = self._oY;
			self._selectRole.baseItem.levelGroup.visible = true;
			self._battleController.findSameHero();
			return;
		}
		if (baseItem.state == BASE_STATE.OPEN) {
			self.createRole(self._selectRole, baseItem, self._selectRole.roleId);
		} else if (baseItem.state == BASE_STATE.HAVE) {
			let role: Role = self._model.roleDic.TryGetValue(baseItem);
			if (role == null) return;
			let moveRole: Role = self._model.roleDic.TryGetValue(self._selectRole.baseItem);
			if (role.roleId == moveRole.roleId) {
				self._model.roleDic.Remove(moveRole.baseItem);
				moveRole.baseItem.state = BASE_STATE.OPEN;
				moveRole.reset();
				ObjectPool.push(moveRole);
				App.Display.removeFromParent(moveRole);
				self.createRole(role, baseItem, role.roleId + 1);
			} else {
				self.createRole(role, self._selectRole.baseItem, role.roleId);
				self.createRole(self._selectRole, baseItem, self._selectRole.roleId);
			}
		}
		self._battleController.findSameHero();
	}

	/** 创建普通角色 */
	private createRole(selectRole: Role, baseItem: BaseItem, roleId: number): void {
		let self = this;
		self._model.roleDic.Remove(selectRole.baseItem);
		selectRole.reset();
		ObjectPool.push(selectRole);
		App.Display.removeFromParent(selectRole);
		baseItem.setLevel(roleId + 1);
		self._battleController.pushRoleToMap(roleId, baseItem);
	}
}