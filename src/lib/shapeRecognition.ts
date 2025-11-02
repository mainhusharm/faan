// Shape recognition utilities for 2D drawing to 3D conversion

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RecognizedShape = 
  | 'circle'
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'line'
  | 'star'
  | 'pentagon'
  | 'hexagon'
  | 'arrow'
  | 'unknown';

/**
 * Calculate the distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get the bounding box of a set of points
 */
export function getBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Calculate the perimeter of a polygon defined by points
 */
export function calculatePerimeter(points: Point[]): number {
  if (points.length < 2) return 0;

  let perimeter = 0;
  for (let i = 0; i < points.length - 1; i++) {
    perimeter += distance(points[i], points[i + 1]);
  }
  // Add distance from last point back to first for closed shapes
  perimeter += distance(points[points.length - 1], points[0]);
  
  return perimeter;
}

/**
 * Calculate the area of a polygon using the shoelace formula
 */
export function calculateArea(points: Point[]): number {
  if (points.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < points.length - 1; i++) {
    area += points[i].x * points[i + 1].y - points[i + 1].x * points[i].y;
  }
  // Close the polygon
  area += points[points.length - 1].x * points[0].y - points[0].x * points[points.length - 1].y;
  
  return Math.abs(area) / 2;
}

/**
 * Detect corners in a path using angle detection
 */
export function detectCorners(points: Point[], angleThreshold: number = 2.5): number {
  if (points.length < 3) return 0;

  // Simplify points first by removing very close consecutive points
  const simplified = simplifyPoints(points, 5);
  
  if (simplified.length < 3) return 0;

  let corners = 0;
  const n = simplified.length;

  for (let i = 1; i < n - 1; i++) {
    const prev = simplified[i - 1];
    const curr = simplified[i];
    const next = simplified[i + 1];

    // Calculate angle at current point
    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
    
    let angleDiff = Math.abs(angle2 - angle1);
    // Normalize angle difference to [0, PI]
    if (angleDiff > Math.PI) {
      angleDiff = 2 * Math.PI - angleDiff;
    }

    // If angle is sharp enough, it's a corner
    if (angleDiff > angleThreshold) {
      corners++;
    }
  }

  return corners;
}

/**
 * Simplify points by removing consecutive points that are too close
 */
export function simplifyPoints(points: Point[], minDistance: number): Point[] {
  if (points.length <= 2) return points;

  const simplified = [points[0]];
  
  for (let i = 1; i < points.length; i++) {
    const lastAdded = simplified[simplified.length - 1];
    if (distance(lastAdded, points[i]) >= minDistance) {
      simplified.push(points[i]);
    }
  }

  return simplified;
}

/**
 * Check if a path is approximately a straight line
 */
export function isStraightLine(points: Point[], threshold: number = 0.15): boolean {
  if (points.length < 2) return false;

  const bbox = getBoundingBox(points);
  const aspectRatio = bbox.width / (bbox.height || 1);

  // Very wide or very tall bounding box suggests a line
  if (aspectRatio > 5 || aspectRatio < 0.2) {
    // Calculate deviation from straight line
    const start = points[0];
    const end = points[points.length - 1];
    const lineLength = distance(start, end);
    
    if (lineLength < 10) return false; // Too short to be a line

    let totalDeviation = 0;
    for (const point of points) {
      // Calculate perpendicular distance to line
      const deviation = Math.abs(
        (end.y - start.y) * point.x - 
        (end.x - start.x) * point.y + 
        end.x * start.y - 
        end.y * start.x
      ) / lineLength;
      totalDeviation += deviation;
    }

    const avgDeviation = totalDeviation / points.length;
    return avgDeviation < lineLength * threshold;
  }

  return false;
}

/**
 * Check if path has an arrowhead at the end
 */
export function hasArrowhead(points: Point[]): boolean {
  if (points.length < 5) return false;

  // Check last few points for sharp angle (arrowhead)
  const lastPoints = points.slice(-5);
  const corners = detectCorners(lastPoints, 1.5);
  
  return corners >= 2; // Arrowhead typically has 2 corners
}

/**
 * Check if path forms a star shape
 */
export function isStarShape(points: Point[]): boolean {
  // Simplified star detection - would need more complex algorithm for real implementation
  const corners = detectCorners(points, 1.8);
  return corners >= 8 && corners <= 12; // Star typically has 10 points (5 outer, 5 inner)
}

/**
 * Main shape recognition function
 */
export function recognizeShape(points: Point[]): RecognizedShape {
  if (points.length < 3) return 'unknown';

  // Calculate basic metrics
  const bbox = getBoundingBox(points);
  const aspectRatio = bbox.width / (bbox.height || 1);
  
  // Check if closed loop (start and end are close)
  const isClosed = distance(points[0], points[points.length - 1]) < 20;

  // Check for line first (open path)
  if (!isClosed) {
    if (isStraightLine(points)) {
      return 'line';
    }
    if (hasArrowhead(points)) {
      return 'arrow';
    }
    return 'unknown';
  }

  // For closed shapes, calculate circularity
  const area = calculateArea(points);
  const perimeter = calculatePerimeter(points);
  
  if (perimeter === 0) return 'unknown';
  
  // Circularity: 4π * area / perimeter²
  // Perfect circle = 1, square ≈ 0.785
  const circularity = (4 * Math.PI * area) / (perimeter * perimeter);

  // Check for circle
  if (circularity > 0.75 && aspectRatio > 0.7 && aspectRatio < 1.3) {
    return 'circle';
  }

  // Check for star
  if (isStarShape(points)) {
    return 'star';
  }

  // Count corners for polygon detection
  const corners = detectCorners(points);

  if (corners >= 2 && corners <= 4) {
    if (corners === 3) {
      return 'triangle';
    }
    if (corners === 4) {
      // Distinguish square from rectangle
      if (aspectRatio > 0.8 && aspectRatio < 1.2) {
        return 'square';
      }
      return 'rectangle';
    }
  }

  if (corners === 5) {
    return 'pentagon';
  }

  if (corners === 6) {
    return 'hexagon';
  }

  // If high circularity but didn't match circle (maybe imperfect circle)
  if (circularity > 0.6) {
    return 'circle';
  }

  return 'unknown';
}

/**
 * Estimate size from bounding box
 */
export function estimateSize(points: Point[]): number {
  const bbox = getBoundingBox(points);
  const avgDimension = (bbox.width + bbox.height) / 2;
  
  // Map drawing size to 3D size
  if (avgDimension < 50) return 0.5; // Small
  if (avgDimension < 150) return 1; // Medium
  if (avgDimension < 250) return 1.5; // Large
  return 2; // Extra large
}

/**
 * Map recognized shape to 3D object type
 */
export function shapeToObject3D(shape: RecognizedShape): string {
  const mapping: Record<RecognizedShape, string> = {
    circle: 'sphere',
    square: 'cube',
    rectangle: 'cube',
    triangle: 'cone',
    line: 'cylinder',
    star: 'torus', // Could create a custom star mesh
    pentagon: 'cylinder', // Prism approximation
    hexagon: 'cylinder', // Prism approximation
    arrow: 'cone', // Arrow approximation
    unknown: 'cube', // Default fallback
  };

  return mapping[shape];
}
