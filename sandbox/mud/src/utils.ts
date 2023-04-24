import { Box3, BufferGeometry, Line, LineBasicMaterial, Mesh, Scene, Vector3 } from "three";

type BoxBoundingBoxPoints = Record<
  'lbf' |
  'lbb' |
  'ltf' |
  'ltb' |
  'rbf' |
  'rbb' |
  'rtf' |
  'rtb', Vector3
>

export const getBoundingBoxPoints = (box: Box3): BoxBoundingBoxPoints => {
  const { min, max } = box;

  return {
    lbf: new Vector3(min.x, min.y, min.z),
    lbb: new Vector3(min.x, min.y, max.z),
    ltf: new Vector3(min.x, max.y, min.z),
    ltb: new Vector3(min.x, max.y, max.z),
    rbf: new Vector3(max.x, min.y, min.z),
    rbb: new Vector3(max.x, min.y, max.z),
    rtf: new Vector3(max.x, max.y, min.z),
    rtb: new Vector3(max.x, max.y, max.z),
  }
}

export const addBoundingBox = (scene: Scene | Mesh, box: Box3) => {
  const {
    lbf,
    lbb,
    ltf,
    ltb,
    rbf,
    rbb,
    rtf,
    rtb,
  } = getBoundingBoxPoints(box);
  
  // Lines
  const lineMaterial = new LineBasicMaterial({ color: 0x0000ff });
  scene.add(new Line(new BufferGeometry().setFromPoints([lbb, lbf]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([lbf, rbf]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([rbf, rbb]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([rbb, lbb]), lineMaterial));

  scene.add(new Line(new BufferGeometry().setFromPoints([ltb, ltf]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([ltf, rtf]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([rtf, rtb]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([rtb, ltb]), lineMaterial));

  scene.add(new Line(new BufferGeometry().setFromPoints([lbb, ltb]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([rbb, rtb]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([lbf, ltf]), lineMaterial));
  scene.add(new Line(new BufferGeometry().setFromPoints([rbf, rtf]), lineMaterial));
}