import Phaser from 'phaser';

export class LightComponent extends Phaser.GameObjects.Image {
  private blinkTimer: Phaser.Time.TimerEvent | null = null;
  private isBlinking: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, blinkTime: number = 150) {
    super(scene, x, y, texture);

    // 设置 anchor 到中心
    this.setOrigin(0.5, 0.5);

    // 初始化 blinkTimer
    this.blinkTimer = this.scene.time.addEvent({
      delay: blinkTime,
      callback: this.toggleVisibility,
      callbackScope: this,
      loop: true,
      paused: true,
    });
   
    this.scene.add.existing(this);
    // this.setVisible(false);
  }

  private toggleVisibility(): void {
    this.setVisible(!this.visible);
  }

  setSize(width: number, height: number): this {
    const originalWidth = this.width;
    const originalHeight = this.height;

    // 按比例调整
    this.setScale(width / originalWidth, height / originalHeight);
    return this;
  }

  splash(): void {
    if (!this.isBlinking) {
      this.isBlinking = true;
      if (this.blinkTimer) {
        this.blinkTimer.paused = false;  // 开始闪烁
      }
    }
  }

  stop(): void {
    if (this.isBlinking) {
      this.isBlinking = false;
      if (this.blinkTimer) {
        this.blinkTimer.paused = true;  // 停止闪烁
      }
      this.setVisible(true);  // 设置可见
    }
  }

  update(delta: number): void {
    // 自动更新定时器
    if (this.isBlinking && this.blinkTimer) {
      this.blinkTimer.elapsed += delta;
      if (this.blinkTimer.elapsed >= this.blinkTimer.delay) {
        this.blinkTimer.callback();
        this.blinkTimer.elapsed = 0;
      }
    }
  }

  destroy(fromScene?: boolean): void {
    if (this.blinkTimer) {
      this.blinkTimer.destroy();
    }
    super.destroy(fromScene);
  }
}
