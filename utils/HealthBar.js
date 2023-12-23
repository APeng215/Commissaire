export default class HealthBar {
    constructor(player) {
      this.player = player;
      this.width = 30; // Ѫ�����
      this.height = 3; // Ѫ���߶�
      this.position = { x: 10, y: 10 }; // Ѫ��λ��
      console.log(player.classID)
      if(player.classID != 0)
        this.dxdy = {dx:28,dy:20}
      else
        this.dxdy = {dx:28,dy:10}
    }
  
    draw(context) {
      context.fillStyle = "rgba(255, 0, 0, 0.8)"; // ��ɫ
      context.fillRect(this.position.x, this.position.y, this.width, this.height);
  
      const healthWidth = (this.player.get_HP() / this.player.get_HP_limit()) * this.width;
  
      context.fillStyle = "rgba(0, 255, 0, 0.8)"; // ��ɫ
      context.fillRect(
        this.position.x,
        this.position.y,
        healthWidth,
        this.height
      );
    }
  
    update() {
      // �����ҪѪ���������λ�ã��������������Ѫ��λ��
      this.position.x = this.player.get_position().x+this.dxdy.dx;
      this.position.y = this.player.get_position().y+this.dxdy.dy;
    }
  }
  