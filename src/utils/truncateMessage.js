export function truncateMessage(message) {
  const addressRegex = /(0x[a-fA-F0-9]{40})/;
  const match = message.match(addressRegex);

  if (match) {
    const truncatedAddress = `${match[0].slice(0, 6)}...${match[0].slice(-4)}`;
    return message.replace(match[0], truncatedAddress);
  }
  return message;
}
