function translation(dx, dy, dz, gl, program) {
  var forMatrix = new Float32Array([
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    dx,
    dy,
    dz,
    1.0,
  ]);

  var uFormMatrix = gl.getUniformLocation(program, "uFormMatrix");
  gl.uniformMatrix4fv(uFormMatrix, false, forMatrix);
}

function scale(sx, sy, sz, gl, program) {
  var forMatrix = new Float32Array([
    sx,
    0.0,
    0.0,
    0.0,
    0.0,
    sy,
    0.0,
    0.0,
    0.0,
    0.0,
    sz,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);

  var uFormMatrix = gl.getUniformLocation(program, "uFormMatrix");
  gl.uniformMatrix4fv(uFormMatrix, false, forMatrix);
}

function shear(angle, gl, program) {
  var cota = 1 / Math.tan(angle);
  var forMatrix = new Float32Array([
    1.0,
    cota,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);

  var uFormMatrix = gl.getUniformLocation(program, "uFormMatrix");
  gl.uniformMatrix4fv(uFormMatrix, false, forMatrix);
}

function rotateZ(angle, gl, program) {
  var sa = Math.sin(angle);
  var ca = Math.cos(angle);
  var forMatrix = new Float32Array([
    ca,
    -sa,
    0.0,
    0.0,
    sa,
    ca,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);

  var uFormMatrix = gl.getUniformLocation(program, "uFormMatrix");
  gl.uniformMatrix4fv(uFormMatrix, false, forMatrix);
}

function rotateX(angle, gl, program) {
  var sa = Math.sin(angle);
  var ca = Math.cos(angle);
  var forMatrix = new Float32Array([
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    ca,
    -sa,
    0.0,
    0.0,
    sa,
    ca,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);

  var uFormMatrix = gl.getUniformLocation(program, "uFormMatrix");
  gl.uniformMatrix4fv(uFormMatrix, false, forMatrix);
}

function rotateY(angle, gl, program) {
  var sa = Math.sin(angle);
  var ca = Math.cos(angle);
  var forMatrix = new Float32Array([
    ca,
    0.0,
    sa,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    -sa,
    0.0,
    ca,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);

  var uFormMatrix = gl.getUniformLocation(program, "uFormMatrix");
  gl.uniformMatrix4fv(uFormMatrix, false, forMatrix);
}

function loadOBJ(url, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load OBJ file: ${response.statusText}`);
      }
      return response.text();
    })
    .then((data) => {
      const vertices = [];
      const indices = [];
      const normals = [];
      const textureCoords = [];

      const lines = data.split("\n");
      for (let line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 1) continue; // Skip empty lines

        if (parts[0] === "v") {
          // Vertex position (x, y, z)
          if (parts.length >= 4) {
            vertices.push(
              parseFloat(parts[1]),
              parseFloat(parts[2]),
              parseFloat(parts[3])
            );
          }
        } else if (parts[0] === "vn") {
          // Vertex normal (nx, ny, nz)
          if (parts.length >= 4) {
            normals.push(
              parseFloat(parts[1]),
              parseFloat(parts[2]),
              parseFloat(parts[3])
            );
          }
        } else if (parts[0] === "vt") {
          // Texture coordinate (u, v)
          if (parts.length >= 3) {
            textureCoords.push(parseFloat(parts[1]), parseFloat(parts[2]));
          }
        } else if (parts[0] === "f") {
          // Face (vertices/indices)
          if (parts.length >= 4) {
            const faceIndices = parts.slice(1).map((part) => {
              const indices = part.split("/");
              return parseInt(indices[0]) - 1; // Ambil indeks vertex, kurangi 1 untuk 0-index
            });

            // Handle quad (4 vertices) by splitting into two triangles
            if (faceIndices.length === 4) {
              indices.push(faceIndices[0], faceIndices[1], faceIndices[2]);
              indices.push(faceIndices[0], faceIndices[2], faceIndices[3]);
            } else if (faceIndices.length === 3) {
              indices.push(...faceIndices); // For triangles
            } else {
              console.warn(
                "Face with unsupported number of vertices:",
                faceIndices.length
              );
            }
          }
        }
      }

      callback(vertices, indices, normals, textureCoords);
    })
    .catch((error) => console.error("Error loading OBJ:", error));
}

export default {
  translation,
  scale,
  shear,
  rotateZ,
  rotateX,
  rotateY,
  loadOBJ,
};
