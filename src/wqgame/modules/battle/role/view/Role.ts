class Role extends BaseRole {

	private _roleId: number;
	private _roleImg: eui.Image;
	/** 角色当前对应的底座 */
	private _baseItem: BaseItem;
	private _lastTime: number = 0;
	private _model: BattleModel;
	private _heroVO: HeroVO;
	/** 是否正在拖拽中 */
	private _isDrop: boolean = false;
	/** 是否守卫 */
	public isGuard: boolean = false;

	public constructor($controller: BaseController, $layer: number) {
		super($controller, $layer);
		let self = this;
		self.touchChildren = self.touchEnabled = false;
		self._model = <BattleModel>self.controller.getModel();
	}

	/** 面板开启执行函数，用于子类继承 */
	public open(...param: any[]): void {
		super.open(param);
		let self = this;
		self._roleId = param[0];
		self._heroVO = GlobleData.getData(GlobleData.HeroVO, self._roleId);
		self.initRole();
	}

	/** 初始化角色 */
	private initRole(): void {
		let self = this;
		self._isDrop = false;
		if (self._roleImg) App.Display.removeFromParent(self._roleImg);
		self._roleImg = new eui.Image(self._heroVO.assetname);
		self.addChild(self._roleImg);
		App.Sound.playEffect(self._heroVO.bornSound);
	}

	public onUpdate(passTime: number): void {
		super.onUpdate(passTime);
		if (this._isDrop) return;
		if (passTime > this._lastTime) {
			// this.searchTarget();
			this._lastTime = passTime + App.Random.randint(this._heroVO.delay - 300, this._heroVO.delay + 300);//下次执行时间
		}
	}

	/** 设置坐标点 */
	public setPosition($x: number, $y: number): void {
		let self = this;
		self.x = $x;
		self.y = $y;
	}

	/** 重置 */
	public reset(): void {
		let self = this;
		self._baseItem = null;
	}

	set heroVO(value: HeroVO) { this._heroVO = value; }
	/** 角色数据信息 */
	get heroVO(): HeroVO { return this._heroVO; }

	get roleImg(): eui.Image { return this._roleImg; }
	/** 角色ID */
	get roleId(): number { return this._roleId; }

	set baseItem(value: BaseItem) { this._baseItem = value; }
	/** 角色当前对应的底座 */
	get baseItem(): BaseItem { return this._baseItem; }

	set isDrop(value: boolean) { this._isDrop = value; }

	/** 是否在移动合成中 */
	get isDrop(): boolean { return this._isDrop; }
}