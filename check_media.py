import urllib.request

urls = [
    "https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/6b3318cc6a7da610e3a55369131b20a2419cda826d558da09da284f09582956d.mp4",
    "https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/99df6a45ad1f9dd7e47b65c064df0ae58c7c22069fadd9aa896754c3bad27123.jpg",
    "https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/76a7b0b20e4992f91bb5febf2fa8edd2d33fd4b7bb0cda5f8ae0fffdff9d5a7e.mp4",
    "https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/eafc13621b9605d30356b7d4396072b2593a46e0c47c96d17ba60ca03d98f925.jpg",
    "https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/aabcdc51e4d9f6c4cbf6656bbd3447d6b50814507395f9e5bd0efecd7c1b22b3.mp4",
    "https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/5f73c2c9094bbeef04fdc241909a4672235142882112ec15c6d130f89bf5fd16.jpg"
]

total = 0
for u in urls:
    try:
        req = urllib.request.Request(u, method='HEAD')
        with urllib.request.urlopen(req) as resp:
            sz = int(resp.headers.get('Content-Length', 0))
            total += sz
            print(f"{u.split('/')[-1]}: {sz} bytes")
    except Exception as e:
        print(f"Error {u}: {e}")

print('Total media size:', total)
