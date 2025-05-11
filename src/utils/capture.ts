import html2canvas from 'html2canvas';

export async function captureURL(url: string) {
  // Create an iframe to load the content
  const iframe = document.createElement('iframe');
  iframe.style.border = 'none';
  iframe.src = url;

  document.body.appendChild(iframe);
  iframe.setAttribute('crossorigin', 'anonymous');
  // Add a sandbox attribute with necessary permissions
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
  // Wait for iframe to load
  await new Promise(resolve => {
    iframe.onload = resolve;
  });

  try {
    // Use html2canvas to capture the iframe content
    // Note: This will still fail for cross-origin content
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    const content = iframeDocument?.body;

    if (!content) throw new Error('No content found in iframe');
    const canvas = await html2canvas(content, {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 1
    });
    const imageData = canvas.toDataURL('image/png');

    // Clean up
    document.body.removeChild(iframe);

    return imageData;
  } catch (err) {
    console.error('Capture error:', err);
    document.body.removeChild(iframe);
    throw new Error('Cannot capture URL content');
  }
}
