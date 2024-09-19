import Phaser from "phaser";
import { LightComponent } from "./Light"; // 假设你已经定义了 LightComponent

export class SpinComponent extends Phaser.GameObjects.Container {
  private lights: LightComponent[] = [];
  private numSpin: number;
  private size: number = 100;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    numSpin: number,
    size: number,
    x: number,
    y: number
  ) {
    super(scene, x, y);
    this.numSpin = numSpin;
    this.size = size;
    this.scene.add.existing(this);

    this.createLights(texture);
    this.positionSprites();
  }

  private createLights(texture: string): void {
    for (let i = 0; i < this.numSpin; i++) {
      const light = new LightComponent(this.scene, 0, 0, texture); // 假设你有个 `lightTexture`
      //   light.setVisible(false);
      light.setDisplaySize(this.size, this.size); // 设置大小
      this.lights.push(light);
      this.add(light);
    }
  }

  // 设置精灵和框架的位置
  private positionSprites(): void {
    const side = Math.floor(this.numSpin / 4);

    for (let i = 0; i < this.numSpin; i++) {
      let x: number, y: number;

      if (i < side) {
        x = this.size * i;
        y = 0;
      } else if (i < 2 * side) {
        x = this.size * side;
        y = this.size * (i - side);
      } else if (i < 3 * side) {
        x = this.size * (3 * side - i);
        y = this.size * side;
      } else {
        x = 0;
        y = this.size * (4 * side - i);
      }

      // 设置 light 的位置，假设转盘的中心是 (266, 327)
      this.lights[i].setPosition(x, y);
    }
  }

  splash(i: number): void {
    this.lights[i].splash();
  }

  stop(i: number): void {
    this.lights[i].stop();
  }

  // 添加 destroy() 方法
  destroy(fromScene?: boolean): void {
    // 遍历销毁每一个 LightComponent
    this.lights.forEach((light) => {
      light.destroy();
    });

    // 调用父类的 destroy 来销毁容器本身
    super.destroy(fromScene);
  }
}
