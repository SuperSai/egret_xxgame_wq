class BattleModel extends BaseModel {

	//关卡表模板数据
	private _levelVO: LevelVO;
	//出战的角色字典
	private _roleDic: TSDictionary<BaseItem, Role>;
	/** 当前的关卡等级 */
	public currMission: number = 1;
	/** 当前游戏中最高级的角色ID */
	public maxRoleId: number = 0;
	/** 一排的底座数量 */
	public hBaseItemCount: number = 5;
	/** 最大的底座数量 */
	public maxBaseCount: number = 0;
	/** 底座的高度 */
	public baseH: number = 100;

	public constructor($controller: BaseController) {
		super($controller)
		let self = this;
		self.init();
	}
	/** 初始化 */
	private init(): void {
		let self = this;
		self._roleDic = new TSDictionary<BaseItem, Role>();
	}

	/** 获取所有底座的状态 */
	get allBaseState(): any[] {
		let self = this;
		let lists: any[] = [];
		for (let i: number = self.maxBaseCount; i > 0; i--) {
			if (i > self._levelVO.openBaseCount) {
				lists.push(BASE_STATE.CLOSE);
			} else {
				lists.push(BASE_STATE.OPEN);
			}
		}
		return lists;
	}

	set levelVO(value: LevelVO) {
		this._levelVO = value;
	}
	/** 关卡表模板数据 */
	get levelVO(): LevelVO {
		return this._levelVO;
	}

	set roleDic(value: TSDictionary<BaseItem, Role>) {
		this._roleDic = value;
	}
	/** 出战的角色字典 */
	get roleDic(): TSDictionary<BaseItem, Role> {
		return this._roleDic;
	}
}

/** 底座的状态 */
enum BASE_STATE {
	/** 关闭状态 */
	CLOSE,
	/** 开启状态 */
	OPEN,
	/** 拥有角色状态 */
	HAVE,
}
