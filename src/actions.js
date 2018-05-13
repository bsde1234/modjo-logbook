export const types = {
  toggleColor: 'TOGGLE_COLOR',
  toggleSector: 'TOGGLE_SECTOR',
  sendBoulders: 'SEND_BOULDERS',
};

export const toggleColor = color => ({
  type: types.toggleColor,
  payload: { color },
});

export const toggleSector = sectorId => ({
  type: types.toggleSector,
  payload: { sectorId },
});

export const sendBoulders = (color, sectors, { type }) => ({
  type: types.sendBoulders,
  payload: {
    sends: sectors.map(sectorId => ({
      color,
      sectorId,
      type,
      sentAt: new Date(), // TODO: Implement in form
      createdAt: new Date(),
    })),
  },
});
