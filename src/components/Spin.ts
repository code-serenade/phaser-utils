import Phaser from "phaser";
import { LightComponent } from "./Light";

export class SpinComponent extends Phaser.GameObjects.Container {
  private lights: LightComponent[] = [];
  private numSpin: number;
  private sizeX: number;
  private sizeY: number;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    numSpin: number,
    sizeX: number,
    sizeY: number,
    x: number,
    y: number
  ) {
    super(scene, x, y);
    this.numSpin = numSpin;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.scene.add.existing(this);

    this.createLights(texture);
    this.positionSprites();
  }

  private createLights(texture: string): void {
    this.lights = Array.from({ length: this.numSpin }, () => {
      const light = new LightComponent(this.scene, 0, 0, texture);
      light.setDisplaySize(this.sizeX, this.sizeY);
      this.add(light);
      return light;
    });
  }

  // 设置精灵和框架的位置
  private positionSprites(): void {
    const side = Math.floor(this.numSpin / 4);

    this.lights.forEach((light, i) => {
      const { x, y } = this.calculatePosition(i, side);
      light.setPosition(x, y);
    });
  }

  private calculatePosition(i: number, side: number): { x: number; y: number } {
    let x = 0,
      y = 0;

    if (i < side) {
      x = this.sizeX * i;
    } else if (i < 2 * side) {
      x = this.sizeX * side;
      y = this.sizeY * (i - side);
    } else if (i < 3 * side) {
      x = this.sizeX * (3 * side - i);
      y = this.sizeY * side;
    } else {
      y = this.sizeY * (4 * side - i);
    }

    return { x, y };
  }

  splash(splashSet: Set<number>): void {
    this.lights.forEach((light, i) => {
      if (splashSet.has(i)) {
        light.splash(); // 触发 splash
      } else {
        light.stop(); // 其他灯光停止
      }
    });
  }

  stopAll(): void {
    this.lights.forEach((light) => light.stop());
  }

  lightsVisible(visibleSet: Set<number>): void {
    this.lights.forEach((light, i) => {
      if (visibleSet.has(i)) {
        light.setVisible(true);
      } else {
        light.setVisible(false);
      }
    });
  }

  lightsInvisible(): void {
    this.lights.forEach((light) => light.setVisible(false));
  }

  // 添加 destroy() 方法
  destroy(fromScene?: boolean): void {
    this.lights.forEach((light) => light.destroy());
    super.destroy(fromScene);
  }
}