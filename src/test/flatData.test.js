import { describe, it, expect } from 'vitest';
import { getBlockName, towerData, towerFloorDetails, floorPlans, REFUGE_FLOORS, isRefugeFlat, getRefugeInfo } from '../services/flatData';

// ── flatData service ────────────────────────────────────────────────────────
describe('flatData service', () => {
  describe('getBlockName', () => {
    it('returns "Canopus" for tower 1', () => {
      expect(getBlockName(1)).toBe('Canopus');
    });

    it('returns "Orion" for tower 2', () => {
      expect(getBlockName(2)).toBe('Orion');
    });

    it('returns "Nova" for tower 3', () => {
      expect(getBlockName(3)).toBe('Nova');
    });

    it('returns "Tower" for invalid tower id', () => {
      expect(getBlockName(99)).toBe('Tower');
    });
  });

  describe('towerData', () => {
    it('has data for all 3 towers', () => {
      expect(Object.keys(towerData)).toHaveLength(3);
    });

    it('tower 1 block name is Tower-1', () => {
      expect(towerData[1].block).toBe('Tower-1');
    });

    it('tower 1 has West and East Facing specs', () => {
      expect(towerData[1].specs['West Facing']).toBeDefined();
      expect(towerData[1].specs['East Facing']).toBeDefined();
    });

    it('tower 1 West Facing specs include M-Bedroom', () => {
      const specs = towerData[1].specs['West Facing'];
      const hasMBedroom = specs.some(([name]) => name === 'M-Bedroom');
      expect(hasMBedroom).toBe(true);
    });

    it('tower 2 has 3 BHK configuration (no Bedroom-3 in west facing)', () => {
      const specs = towerData[2].specs['West Facing'];
      const hasBedroom3 = specs.some(([name]) => name === 'Bedroom-3');
      expect(hasBedroom3).toBe(false);
    });
  });

  describe('towerFloorDetails', () => {
    it('has 50 floors for each tower', () => {
      expect(Object.keys(towerFloorDetails[1])).toHaveLength(50);
      expect(Object.keys(towerFloorDetails[2])).toHaveLength(50);
      expect(Object.keys(towerFloorDetails[3])).toHaveLength(50);
    });

    it('tower 1 floors have correct BHK type', () => {
      expect(towerFloorDetails[1][1].bhk).toBe('4 BHK');
    });

    it('tower 2 floors have correct BHK type', () => {
      expect(towerFloorDetails[2][1].bhk).toBe('3 BHK');
    });

    it('tower 3 floors have correct BHK type', () => {
      expect(towerFloorDetails[3][1].bhk).toBe('4 BHK');
    });
  });

  describe('floorPlans', () => {
    it('has floor plans for all 3 towers', () => {
      expect(floorPlans[1]).toBeDefined();
      expect(floorPlans[2]).toBeDefined();
      expect(floorPlans[3]).toBeDefined();
    });

    it('tower 1 floor plan 1 has 4 flats', () => {
      expect(floorPlans[1][1].flats).toHaveLength(4);
    });

    it('each flat in tower 1 has required fields', () => {
      floorPlans[1][1].flats.forEach(flat => {
        expect(flat).toHaveProperty('points');
        expect(flat).toHaveProperty('size');
        expect(flat).toHaveProperty('facing');
      });
    });

    it('layout number cycles correctly: floor 4 uses layout 1', () => {
      // layout = ((floor - 1) % 3) + 1
      const floor = 4;
      const layoutNumber = ((floor - 1) % 3) + 1;
      expect(layoutNumber).toBe(1);
      expect(floorPlans[1][layoutNumber]).toBeDefined();
    });
  });

  describe('Refuge Flats configuration', () => {
    it('defines the correct refuge floors [12, 21, 39, 48]', () => {
      expect(REFUGE_FLOORS).toEqual([12, 21, 39, 48]);
    });

    it('identifies flat 02 on refuge floors as refuge flats', () => {
      [12, 21, 39, 48].forEach(floor => {
        // By 0-indexed number (idx 1 is flat 02)
        expect(isRefugeFlat(floor, 1)).toBe(true);
        // By flat number string
        expect(isRefugeFlat(floor, `${floor}02`)).toBe(true);
      });
    });

    it('identifies non-refuge flats on refuge floors as false', () => {
      [12, 21, 39, 48].forEach(floor => {
        expect(isRefugeFlat(floor, 0)).toBe(false); // flat 01
        expect(isRefugeFlat(floor, 2)).toBe(false); // flat 03
        expect(isRefugeFlat(floor, 3)).toBe(false); // flat 04
        expect(isRefugeFlat(floor, `${floor}01`)).toBe(false);
      });
    });

    it('identifies flat 02 on non-refuge floors as false', () => {
      [1, 5, 10, 20, 30, 50].forEach(floor => {
        expect(isRefugeFlat(floor, 1)).toBe(false);
        expect(isRefugeFlat(floor, `${floor}02`)).toBe(false);
      });
    });

    it('provides descriptive refuge information', () => {
      const info = getRefugeInfo();
      expect(info.badge).toContain('Refuge');
      expect(info.description).toContain('evacuation');
    });
  });
});
