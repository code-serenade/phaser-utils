export class StepTimerController {
  private targetSteps: number = 0;
  private currentSteps: number = 0;
  private startSpeedList: number[] = [];
  private endSpeedList: number[] = [];
  private defaultSpeed: number = 100;
  private isRunning: boolean = false;
  private onUpdate: () => void;
  private onComplete: () => void; // 新增完成时的回调

  constructor(
    onUpdate: () => void,
    onComplete: () => void, // 新增的参数，用于通知父对象
    defaultSpeed: number = 100
  ) {
    this.onUpdate = onUpdate; // 每次步数更新时执行的回调
    this.onComplete = onComplete; // 执行完成时的回调
    this.defaultSpeed = defaultSpeed;
  }

  start(
    steps: number,
    startSpeedList: number[],
    endSpeedList: number[],
    speed?: number
  ): void {
    if (this.isRunning) return; // 防止重复启动
    this.isRunning = true;
    this.targetSteps = steps;
    this.currentSteps = 0;
    this.startSpeedList = startSpeedList;
    this.endSpeedList = endSpeedList;

    // 如果传入了 speed 参数，则修改默认速度
    if (speed !== undefined) {
      this.defaultSpeed = speed;
    }

    this.scheduleNextStep();
  }

  private scheduleNextStep(): void {
    if (!this.isRunning) return;

    const speed = this.getStepSpeed();
    setTimeout(() => {
      this.onUpdate; // 执行每步更新
      this.currentSteps++;

      // 如果达到目标步数，则停止
      if (this.currentSteps >= this.targetSteps) {
        this.stop();
        return;
      }

      this.scheduleNextStep();
    }, speed);
  }

  private getStepSpeed(): number {
    const startSteps = this.startSpeedList.length;
    const endSteps = this.endSpeedList.length;

    if (this.currentSteps < startSteps) {
      return this.startSpeedList[this.currentSteps];
    }

    if (this.currentSteps >= this.targetSteps - endSteps) {
      const index = this.currentSteps - (this.targetSteps - endSteps);
      return this.endSpeedList[index];
    }

    return this.defaultSpeed;
  }

  stop(): void {
    this.isRunning = false;
    this.onComplete(); // 运行结束时发送通知
  }
}
