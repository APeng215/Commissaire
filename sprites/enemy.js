import Sprite from "./sprite.js";
import CollisionCalculator from "../utils/CollisionCalculator.js";
export default class Enemy extends Sprite {
	/**
	 * ������
	 * @param {object} position - ���˵�λ��
	 * @param {array} collisionBlocks - ��ײ������
	 * @param {string} imageSrc - ����ͼ���·��
	 * @param {number} frameRate - ���˶�����֡��
	 * @param {number} scale - ���˵����ű���
	 * @param {object} animations - ���˶�������
	 * @param {int} HP_limit - ���˵��������ֵ
	 * @param {int} HP - ���˵�����ֵ
	 * @param {int} damage - ���˵Ĺ�����
	 */
	constructor({
		position,
		collisionBlocks,
		imageSrc,
		frameRate,
		scale = 0.5,
		animations,
	}) {
		super({ imageSrc, frameRate, scale });
		this.jumpingCount = 0;
		this.position = position;
		this.velocity = {
			x: 0,
			y: 1,
		};

		this.collisionBlocks = collisionBlocks;
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 10,
			height: 10,
		};

		this.animations = animations;
		this.lastDirection = 'left';

		for (let key in this.animations) {
			const image = new Image();
			image.src = this.animations[key].imageSrc;

			this.animations[key].image = image;
		}

		this.camerabox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};
		this.HP_limit = 100;
		this.HP = this.HP_limit;
		this.damage = 5;
	}


	/*���������鷽�� */
	get_HP_limit() {
		return this.HP_limit;
	}
	set_HP_limit(value) {
		this.HP_limit = value;
	}
	get_HP() {
		return this.HP;
	}
	set_HP(value) {
		this.HP = value;
	}
	get_damage() {
		return this.damage;
	}
	set_damage(value) {
		this.damage = value;
	}
	/**
	 * ������Ծ
	 */
	try2Jump() {
		if (this.jumpingCount == 2) {
			return;
		}
		this.#jump();
	}

	/**
	 * ��������
	 */
	
	attack() {
		//���빥���߼�
	}
	
	/**
	 * ��Ծ����
	 */
	#jump() {
		this.velocity.y = -1.5;
		this.jumpingCount++;
	}

	/**
	 * ��Ծ���÷���
	 */
	#jumpResets() {
		this.jumpingCount = 0;
	}

	/**
	 * �л����鷽��
	 * @param {string} key - ����ļ���
	 */
	switchSprite(key) {
		if (this.image == this.animations[key].image || !this.loaded) {
			return;
		}

		this.image = this.animations[key].image;
		this.frameBuffer = this.animations[key].frameBuffer;
		this.frameRate = this.animations[key].frameRate;
		
	}

	/**
	 * ����camerabox
	 */
	updateCamerabox() {
		this.camerabox = {
			position: {
				x: this.position.x - 50,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};
	}

	/**
	 * ���ˮƽ�����ϵ���ײ
	 */
	checkforHorizontalCanvasCollision() {
		if (
			this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
			this.hitbox.position.x + this.velocity.x <= 0
		) {
			this.velocity.x = 0; // ����ͨ����Ե
		}
	}

	/**
	 * �Ƿ���Ҫ����ƽ�����
	 * @param {object} canvas - ��������
	 * @param {object} camera - �������
	 */
	shouldPanCameraToLeft({ canvas, camera }) {
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;

		if (cameraboxRightSide >= 576) return;

		if (cameraboxRightSide >= canvas.width / 4 + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	/**
	 * �Ƿ���Ҫ����ƽ�����
	 * @param {object} canvas - ��������
	 * @param {object} camera - �������
	 */
	shouldPanCameraToRight({ canvas, camera }) {
		if (this.camerabox.position.x <= 0) return;
		if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	/**
	 * �Ƿ���Ҫ����ƽ�����
	 * @param {object} canvas - ��������
	 * @param {object} camera - �������
	 */
	shouldPanCameraDown({ canvas, camera }) {
		if (this.camerabox.position.y + this.velocity.y <= 0) return;

		if (this.camerabox.position.y <= Math.abs(camera.position.y) + canvas.height / 4) {
			camera.position.y -= this.velocity.y;
		}
	}

	/**
	 * �Ƿ���Ҫ����ƽ�����
	 * @param {object} canvas - ��������
	 * @param {object} camera - �������
	 */
	shouldPanCameraUp({ canvas, camera }) {
		if (
			this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
			432
		)
			return;

		if (
			this.camerabox.position.y + this.camerabox.height >=
			Math.abs(camera.position.y) + canvas.height / 4
		) {
			camera.position.y -= this.velocity.y;
		}
	}

	/**
	 * ���·���
	 */
	update() {
		this.updateFrames();
		this.updateHitbox();

		this.updateCamerabox();
		// c.fillStyle = 'rgba(0, 0, 255, 0.2)'
		// c.fillRect (
		// 	this.camerabox.position.x,
		// 	this.camerabox.position.y,
		// 	this.camerabox.width,
		// 	this.camerabox.height )

		//����ͼ��
		c.fillStyle = "rgba(0, 255, 0, 0.2)";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		c.fillStyle = "rgba(255, 0, 0, 0.2)";
		c.fillRect(
			this.hitbox.position.x,
			this.hitbox.position.y,
			this.hitbox.width,
			this.hitbox.height
		);
	
		this.draw();

		this.position.x += this.velocity.x;
		this.updateHitbox();
		this.checkForHorizontalCollisions(); //ע������
		this.applyGravity();
		this.updateHitbox();
		this.checkForVerticalCollisions();
	}

	/**
	 * ����hitbox
	 */
	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x + 35,
				y: this.position.y + 26,
			},
			width: 14,
			height: 27,
		};
	}

	/**
	 * ���ˮƽ��ײ
	 */
	checkForHorizontalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				CollisionCalculator.hasCollision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
			) {
				if (this.velocity.x >= 0) {
					this.velocity.x = 0;
					const offset =
						this.hitbox.position.x - this.position.x + this.hitbox.width;
					this.position.x = collisionBlock.position.x - offset - 0.01; // ��ȥ���һ��
				}

				if (this.velocity.x < 0) {
					this.velocity.x = 0;

					const offset = this.hitbox.position.x - this.position.x;
					this.position.x =
						collisionBlock.position.x + collisionBlock.width - offset + 0.01; // �������һ��
				}
			}
		}
	}

	/**
	 * Ӧ������
	 */
	applyGravity() {
		this.velocity.y += gravity;
		this.position.y += this.velocity.y;
	}

	/**
	 * ��鴹ֱ��ײ
	 */
	checkForVerticalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				CollisionCalculator.hasCollision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
			) {
				if (this.velocity.y >= 0) {
					this.velocity.y = 0;
					this.#jumpResets();
					const offset =
						this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.position.y = collisionBlock.position.y - offset - 0.01; // ��ȥ���һ��
					break;
				}

				if (this.velocity.y < 0) {
					this.velocity.y = 0;

					const offset = this.hitbox.position.y - this.position.y;
					this.position.y =
						collisionBlock.position.y + collisionBlock.height - offset + 0.01; // �������һ��
					break;
				}
			}
		}
	}
}
