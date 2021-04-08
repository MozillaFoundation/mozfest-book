function GetParentScrollContainer(element) {
  let scrollContainer = document.querySelector(".is-scrollcontainer");
  if (!scrollContainer) return false;
  return scrollContainer.contains(element) ? scrollContainer : false;
}

export default GetParentScrollContainer;
