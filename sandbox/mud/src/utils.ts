import { Box3, BufferGeometry, Line, LineBasicMaterial, Mesh, Scene, Vector3 } from "three";

const createXLinePoints = (from: number, to: number, y: number, z: number): Vector3[] => [
  new Vector3(from, y, z),
  new Vector3(to, y, z),
]
const createZLinePoints = (from: number, to: number, x: number, y: number): Vector3[] => [
  new Vector3(x, y, from),
  new Vector3(x, y, to),
]
const createYLinePoints = (from: number, to: number, x: number, z: number): Vector3[] => [
  new Vector3(x, from, z),
  new Vector3(x, to, z),
]

const createLineGeometry = (points: Vector3[]) => new BufferGeometry().setFromPoints(points);

export const addBoundingBox = (scene: Scene | Mesh, box: Box3) => {
  const { min, max } = box;

  const material = new LineBasicMaterial({ color: 0x0000ff });

  scene.add(new Line(createLineGeometry(createXLinePoints(min.x, max.x, min.y, max.z)), material));
  scene.add(new Line(createLineGeometry(createXLinePoints(min.x, max.x, max.y, max.z)), material));
  scene.add(new Line(createLineGeometry(createXLinePoints(min.x, max.x, min.y, min.z)), material));
  scene.add(new Line(createLineGeometry(createXLinePoints(min.x, max.x, max.y, min.z)), material));

  scene.add(new Line(createLineGeometry(createYLinePoints(min.y, max.y, min.x, max.z)), material));
  scene.add(new Line(createLineGeometry(createYLinePoints(min.y, max.y, max.x, max.z)), material));
  scene.add(new Line(createLineGeometry(createYLinePoints(min.y, max.y, min.x, min.z)), material));
  scene.add(new Line(createLineGeometry(createYLinePoints(min.y, max.y, max.x, min.z)), material));

  scene.add(new Line(createLineGeometry(createZLinePoints(min.z, max.z, min.x, max.y)), material));
  scene.add(new Line(createLineGeometry(createZLinePoints(min.z, max.z, max.x, max.y)), material));
  scene.add(new Line(createLineGeometry(createZLinePoints(min.z, max.z, min.x, min.y)), material));
  scene.add(new Line(createLineGeometry(createZLinePoints(min.z, max.z, max.x, min.y)), material));

}