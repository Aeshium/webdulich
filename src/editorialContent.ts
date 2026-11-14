export type EditorialSection = {
  title: string
  paragraphs: string[]
  image?: string
}

export type SolutionItem = {
  slug: string
  number: string
  title: string
  description: string
  image: string
  intro: string
  sections: EditorialSection[]
  relatedExperiences: string[]
}

export type ExperienceItem = {
  slug: string
  number: string
  type: string
  title: string
  description: string
  destination: string
  region: string
  image: string
  intro: string
  sections: EditorialSection[]
  gallery: string[]
}

export type StoryItem = {
  slug: string
  number: string
  category: string
  title: string
  excerpt: string
  destination: string
  image: string
  read: string
  experienceSlug?: string
  sections: EditorialSection[]
}

export type ContentCollection = 'solutions' | 'experiences' | 'blog'

export type ContentRoute = {
  collection: ContentCollection
  slug: string
}

export const solutionItems: SolutionItem[] = [
  {
    slug: 'thien-nhien',
    number: '01',
    title: 'Miền đất & thiên nhiên',
    description: 'Từ núi cao, rừng sâu đến những miền biển đầy nắng.',
    image: 'photo-1464822759023-fed622ff2c3b',
    intro: 'Có những miền đất chỉ cần một khoảng lặng để hiện ra thật rõ: đường núi phía xa, mặt nước khẽ đổi màu, hay một lối nhỏ dẫn vào bản làng.',
    sections: [
      {
        title: 'Nhìn cảnh sắc bằng nhiều nhịp độ',
        paragraphs: [
          'LUMI gom những khung cảnh thiên nhiên thành một hành trình chậm rãi. Một dãy núi không chỉ là đường viền nơi chân trời; đó còn là sương sớm, tiếng gió và sắc xanh thay đổi theo từng giờ.',
          'Từ ảnh toàn cảnh đến những chi tiết gần gũi, mỗi lát cắt gợi mở một cách quan sát khác nhau thay vì cố kể hết mọi điều trong một khung hình.',
        ],
        image: 'photo-1501785888041-af3ef285b470',
      },
      {
        title: 'Địa danh gắn với câu chuyện địa phương',
        paragraphs: [
          'Cảnh quan trở nên có ý nghĩa hơn khi được đặt cạnh câu chuyện về con người và đời sống nơi đó. Những lời kể ngắn giúp người xem hiểu thêm về mùa vụ, nếp sinh hoạt và cách cộng đồng gắn bó với thiên nhiên.',
          'Các điểm đến được giới thiệu như lời mời tìm hiểu, không phải hướng dẫn đặt tour hay thay thế thông tin du lịch chính thức.',
        ],
      },
    ],
    relatedExperiences: ['ninh-binh', 'mien-bien'],
  },
  {
    slug: 'di-san',
    number: '02',
    title: 'Di sản & văn hóa',
    description: 'Chạm vào ký ức địa phương qua kiến trúc và chuyện kể.',
    image: 'photo-1528181304800-259b08848526',
    intro: 'Di sản hiện diện trong mái nhà, nếp phố và những câu chuyện được truyền lại qua nhiều thế hệ. Mỗi nơi lưu giữ một nhịp sống riêng.',
    sections: [
      {
        title: 'Từ dấu tích đến đời sống hôm nay',
        paragraphs: [
          'Một công trình cổ không đứng tách rời khỏi con người. Âm thanh buổi sớm, hàng quán bên đường và những sinh hoạt thường ngày cũng góp phần làm nên diện mạo của di sản.',
          'LUMI kể các lớp thời gian bằng hình ảnh và ghi chép ngắn, để người xem có thể quan sát chi tiết mà vẫn cảm nhận được không khí của vùng đất.',
        ],
        image: 'photo-1513415277900-a62401e19be4',
      },
      {
        title: 'Tôn trọng câu chuyện của cộng đồng',
        paragraphs: [
          'Văn hóa không chỉ là điều để ngắm nhìn. Cách giới thiệu cần tôn trọng bối cảnh, tên gọi và góc nhìn của người đang gìn giữ những giá trị ấy.',
          'Những bài viết của LUMI hướng tới sự tò mò có trách nhiệm: cung cấp ngữ cảnh, tránh biến phong tục hay đời sống riêng tư thành phông nền trang trí.',
        ],
      },
    ],
    relatedExperiences: ['hoi-an', 'hue'],
  },
  {
    slug: 'am-thuc',
    number: '03',
    title: 'Ẩm thực bản địa',
    description: 'Khám phá văn hóa vùng miền qua hương vị và con người.',
    image: 'photo-1504674900247-0877df9cc836',
    intro: 'Một món ăn thường bắt đầu từ nguyên liệu của vùng đất, nhưng được nhớ lâu bởi bàn tay và câu chuyện của người làm ra nó.',
    sections: [
      {
        title: 'Hương vị kể về nơi chốn',
        paragraphs: [
          'Mùa nào thức nấy, cách nêm nếm và những nguyên liệu quen thuộc tạo nên khác biệt giữa các miền. Một bữa ăn có thể mở ra câu chuyện về khí hậu, nghề nghiệp và nếp sống.',
          'LUMI chọn kể từ những chi tiết gần gũi: tiếng bếp, cách chuẩn bị món ăn và khoảnh khắc mọi người cùng ngồi lại.',
        ],
        image: 'photo-1547592180-85f173990554',
      },
      {
        title: 'Gặp gỡ người giữ vị quê',
        paragraphs: [
          'Đằng sau món ăn là ký ức, kỹ năng và những thay đổi qua thời gian. Ghi chép từ người nấu giúp câu chuyện ẩm thực có chiều sâu hơn một danh sách món ngon.',
          'Mỗi bài giới thiệu là điểm khởi đầu để tìm hiểu thêm về vùng miền, không phải đánh giá hay xếp hạng trải nghiệm ăn uống.',
        ],
      },
    ],
    relatedExperiences: ['hue', 'mien-tay'],
  },
]

export const experienceItems: ExperienceItem[] = [
  {
    slug: 'ninh-binh',
    number: '01',
    type: 'KHÔNG GIAN 360°',
    title: 'Đi giữa miền non nước',
    description: 'Mở rộng góc nhìn, chậm rãi khám phá cảnh sắc Ninh Bình.',
    destination: 'Ninh Bình',
    region: 'BẮC BỘ',
    image: 'photo-1501785888041-af3ef285b470',
    intro: 'Giữa những dãy núi đá và dòng nước xanh, mỗi khúc quanh lại mở ra một góc nhìn mới. Hãy thử dừng lại lâu hơn trước khi đi tiếp.',
    sections: [
      {
        title: 'Một hành trình của những khoảng lặng',
        paragraphs: [
          'Mặt nước phản chiếu mây trời, mái chèo khẽ rẽ dòng và những vách đá nối nhau thành một đường chân trời tĩnh lặng. Cảnh sắc Ninh Bình không cần vội vã để gây ấn tượng.',
          'Bộ ảnh đưa người xem qua nhiều lớp không gian, từ góc nhìn rộng của thung nước đến những chi tiết nhỏ ven bờ.',
        ],
        image: 'photo-1555921015-5532091f6026',
      },
      {
        title: 'Lắng nghe nhịp chèo',
        paragraphs: [
          'Tiếng nước, tiếng mái chèo và âm thanh của thiên nhiên tạo nên nhịp điệu riêng cho chuyến đi. Hãy hình dung mình đang trôi qua một buổi sáng yên ả giữa miền di sản.',
          'Đây là trang giới thiệu bằng hình ảnh và nội dung biên tập; chưa phát âm thanh hay tour 360° thực tế.',
        ],
      },
    ],
    gallery: ['photo-1501785888041-af3ef285b470', 'photo-1555921015-5532091f6026'],
  },
  {
    slug: 'hoi-an',
    number: '02',
    type: 'ÂM THANH & CÂU CHUYỆN',
    title: 'Nghe Hội An kể chuyện',
    description: 'Một chuyến tản bộ bằng hình ảnh giữa những con phố cổ.',
    destination: 'Hội An',
    region: 'MIỀN TRUNG',
    image: 'photo-1528181304800-259b08848526',
    intro: 'Khi chiều xuống, sắc vàng của những bức tường đổi khác dưới ánh đèn. Hội An gợi nhớ bằng những âm thanh rất đỗi đời thường.',
    sections: [
      {
        title: 'Phố cổ qua những bước chân',
        paragraphs: [
          'Một cánh cửa gỗ, chiếc đèn lồng trước hiên hay bóng người đi qua con phố nhỏ đều lưu giữ dấu vết của nhiều lớp thời gian.',
          'Thay vì chỉ nhìn những góc quen thuộc, câu chuyện đưa người xem chú ý đến nhịp sống đang tiếp diễn phía sau khung cảnh.',
        ],
        image: 'photo-1528181304800-259b08848526',
      },
      {
        title: 'Những thanh âm bên dòng Hoài',
        paragraphs: [
          'Tiếng rao, tiếng trò chuyện và dòng nước chảy hòa thành một bản ghi nhớ về phố. Hãy tưởng tượng chuyến tản bộ bắt đầu khi phố vừa lên đèn.',
          'Âm thanh hiện được giới thiệu bằng nội dung biên tập; bản demo chưa tích hợp bản ghi âm thực tế.',
        ],
      },
    ],
    gallery: ['photo-1528181304800-259b08848526', 'photo-1513415277900-a62401e19be4'],
  },
  {
    slug: 'mien-bien',
    number: '03',
    type: 'BỘ SƯU TẬP HÌNH ẢNH',
    title: 'Sắc xanh miền biển',
    description: 'Gom những khoảnh khắc trong veo dọc theo bờ biển Việt Nam.',
    destination: 'Miền biển',
    region: 'DỌC DẢI ĐẤT VIỆT',
    image: 'photo-1510414842594-a61c69b5ae57',
    intro: 'Đường bờ biển nối những làng chài, bãi cát và chân trời rộng mở. Mỗi khung hình giữ lại một sắc xanh khác nhau.',
    sections: [
      {
        title: 'Từ bình minh đến cuối ngày',
        paragraphs: [
          'Ánh sáng sớm trong trẻo, mặt nước chuyển màu vào buổi trưa và sắc trời lắng xuống lúc hoàng hôn tạo nên ba nhịp cảm xúc khác nhau.',
          'Bộ sưu tập ảnh gợi ý hành trình qua những khoảnh khắc thường ngày bên biển, không chỉ những góc nhìn postcard.',
        ],
        image: 'photo-1500375592092-40eb2168fd21',
      },
      {
        title: 'Nhịp sống ven bờ',
        paragraphs: [
          'Thuyền trở về, lưới được gỡ và phiên chợ sớm bắt đầu. Đời sống ven biển là một phần không thể thiếu của câu chuyện cảnh quan.',
          'LUMI ưu tiên những hình ảnh có ngữ cảnh và sự đồng thuận, để vẻ đẹp của vùng biển đi cùng sự tôn trọng cộng đồng địa phương.',
        ],
      },
    ],
    gallery: ['photo-1510414842594-a61c69b5ae57', 'photo-1500375592092-40eb2168fd21'],
  },
  {
    slug: 'hue',
    number: '04',
    type: 'DI SẢN & ĐỜI SỐNG',
    title: 'Huế, nhịp chậm bên dòng Hương',
    description: 'Một lát cắt về kiến trúc, khu vườn và nhịp sống xứ Huế.',
    destination: 'Huế',
    region: 'MIỀN TRUNG',
    image: 'photo-1513415277900-a62401e19be4',
    intro: 'Huế mang vẻ trầm tĩnh của một cố đô, nhưng vẫn chuyển động trong đời sống hàng ngày bên dòng Hương và những khu vườn xanh.',
    sections: [
      {
        title: 'Dấu xưa giữa thành phố hôm nay',
        paragraphs: [
          'Những mái ngói, hàng cây và khoảng sân rợp bóng tạo nên một nhịp điệu khác giữa lòng thành phố. Di sản hiện diện trong không gian sống, không chỉ ở những công trình nổi tiếng.',
          'Câu chuyện đi từ những chi tiết kiến trúc đến cách người dân gìn giữ nếp nhà và ký ức của vùng đất.',
        ],
        image: 'photo-1514894780887-121968d00567',
      },
      {
        title: 'Một miền vị giác tinh tế',
        paragraphs: [
          'Ẩm thực Huế gắn với sự chỉn chu trong cách chuẩn bị và trình bày. Từng món ăn mang dấu ấn của nguyên liệu, mùa vụ và thói quen địa phương.',
          'Hành trình kết nối di sản với đời sống thường nhật, qua những câu chuyện được kể bằng hình ảnh và ghi chép.',
        ],
      },
    ],
    gallery: ['photo-1513415277900-a62401e19be4', 'photo-1504674900247-0877df9cc836'],
  },
  {
    slug: 'mien-tay',
    number: '05',
    type: 'SÔNG NƯỚC & ẨM THỰC',
    title: 'Miền Tây, theo dòng phù sa',
    description: 'Theo dấu những con sông, vườn cây và bữa ăn miền sông nước.',
    destination: 'Đồng bằng sông Cửu Long',
    region: 'NAM BỘ',
    image: 'photo-1500375592092-40eb2168fd21',
    intro: 'Ở miền Tây, con nước dẫn lối qua vườn cây, bến nhỏ và những cuộc gặp gỡ thân tình. Mỗi ngày bắt đầu theo một nhịp riêng của dòng sông.',
    sections: [
      {
        title: 'Đi theo những nhánh sông',
        paragraphs: [
          'Bến đò, hàng dừa nước và những chiếc ghe chở đầy sản vật tạo nên bức tranh nhiều chuyển động. Dòng sông kết nối xóm làng và cũng mang theo câu chuyện của mỗi mùa.',
          'Những khung hình được sắp xếp như một chuyến đi dọc theo miền phù sa, từ mặt nước rộng đến lối nhỏ dưới tán cây.',
        ],
        image: 'photo-1500530855697-b586d89ba3ee',
      },
      {
        title: 'Bữa cơm của miền đất lành',
        paragraphs: [
          'Rau trái theo mùa, cá tôm từ sông nước và cách nấu giản dị làm nên những bữa ăn gần gũi. Hương vị thường được nhớ cùng người đã mời mình ngồi lại.',
          'LUMI kể về món ăn qua nguyên liệu và con người, đồng thời khuyến khích tìm hiểu thêm về văn hóa địa phương.',
        ],
      },
    ],
    gallery: ['photo-1500375592092-40eb2168fd21', 'photo-1504674900247-0877df9cc836'],
  },
]

export const storyItems: StoryItem[] = [
  {
    slug: 'ninh-binh-dong-nuoc',
    number: '01',
    category: 'THIÊN NHIÊN',
    title: 'Một ngày trôi theo dòng nước Ninh Bình',
    excerpt: 'Len qua miền núi đá, lắng nghe nhịp chèo khua giữa thung xanh.',
    destination: 'Ninh Bình',
    image: 'photo-1501785888041-af3ef285b470',
    read: '06 PHÚT',
    experienceSlug: 'ninh-binh',
    sections: [
      {
        title: 'Sớm mai giữa thung nước',
        paragraphs: [
          'Sương còn đọng trên những triền núi khi con thuyền rời bến. Mặt nước phẳng lặng phản chiếu mây trời, thỉnh thoảng chỉ khẽ lay bởi một mái chèo đi ngang.',
          'Ninh Bình không mở ra bằng một khung cảnh duy nhất. Càng đi sâu, những dãy đá càng đổi hình, các khoảng xanh nối nhau và tiếng chim vọng lại từ phía xa.',
        ],
        image: 'photo-1555921015-5532091f6026',
      },
      {
        title: 'Những điều nhỏ khiến chuyến đi ở lại',
        paragraphs: [
          'Người chèo thuyền kể về con nước, về lối rẽ quen thuộc và cách cảnh vật đổi khác theo mùa. Câu chuyện giản dị làm cho chuyến đi gần gũi hơn cả tấm ảnh toàn cảnh.',
          'Khi thuyền cập bến, dư âm còn lại là nhịp chèo đều và màu xanh mở rộng trước mắt — một lời nhắc rằng đôi khi khám phá đẹp nhất là biết đi chậm.',
        ],
      },
    ],
  },
  {
    slug: 'hoi-an-pho-len-den',
    number: '02',
    category: 'VĂN HÓA',
    title: 'Hội An, khi phố lên đèn',
    excerpt: 'Những sắc màu, tiếng rao và câu chuyện cũ còn ở lại bên sông.',
    destination: 'Hội An',
    image: 'photo-1528181304800-259b08848526',
    read: '04 PHÚT',
    experienceSlug: 'hoi-an',
    sections: [
      {
        title: 'Sắc vàng trong buổi chiều muộn',
        paragraphs: [
          'Nắng cuối ngày nghiêng qua những mái nhà cũ, làm con phố như chậm lại. Tiếng bước chân, tiếng xe đạp và lời chào hỏi nối nhau giữa các hiên nhà.',
          'Hội An đẹp không chỉ bởi ánh đèn lồng. Vẻ duyên dáng của phố còn nằm trong những điều bình thường: cánh cửa mở, giàn hoa trước sân và dòng người qua lại.',
        ],
        image: 'photo-1513415277900-a62401e19be4',
      },
      {
        title: 'Một thành phố được gìn giữ bằng đời sống',
        paragraphs: [
          'Di sản sống nhờ những người tiếp tục ở lại, làm nghề và chăm chút cho từng nếp nhà. Khi phố lên đèn, ký ức cũ và nhịp sống mới cùng hiện diện.',
          'Đi bộ qua phố là cách để nhận ra rằng mỗi góc nhỏ đều có câu chuyện riêng, chỉ cần dành đủ thời gian để lắng nghe.',
        ],
      },
    ],
  },
  {
    slug: 'huong-vi-xu-hue',
    number: '03',
    category: 'ẨM THỰC',
    title: 'Hương vị theo chân người Huế',
    excerpt: 'Từ căn bếp nhỏ đến mâm cơm ấm, vị Huế kể câu chuyện của một miền đất.',
    destination: 'Huế',
    image: 'photo-1504674900247-0877df9cc836',
    read: '05 PHÚT',
    experienceSlug: 'hue',
    sections: [
      {
        title: 'Bắt đầu từ nguyên liệu địa phương',
        paragraphs: [
          'Ẩm thực Huế được nhớ bởi sự hài hòa giữa nguyên liệu, gia vị và cách trình bày. Từ món ăn trong bữa cơm nhà đến những món quà nhỏ, mỗi hương vị đều gắn với một nếp sống.',
          'Trong căn bếp, công thức được truyền lại bằng lời nói và đôi tay. Mỗi người nấu thêm vào đó một chút ký ức của riêng mình.',
        ],
        image: 'photo-1547592180-85f173990554',
      },
      {
        title: 'Bữa ăn là một cuộc gặp gỡ',
        paragraphs: [
          'Món ăn thường đi cùng câu chuyện về người làm ra nó: cách chọn nguyên liệu, bí quyết giữ vị và những dịp cả nhà quây quần.',
          'Vì thế, khám phá ẩm thực Huế cũng là gặp gỡ con người và nếp sống của cố đô. Mỗi bữa ăn để lại một ký ức có thể theo ta xa hơn cả chuyến đi.',
        ],
      },
    ],
  },
  {
    slug: 'nhung-khuc-quanh-ha-giang',
    number: '04',
    category: 'CHUYỆN ĐƯỜNG XA',
    title: 'Qua những khúc quanh Hà Giang',
    excerpt: 'Cung đường mở ra núi cao, chợ phiên và những cuộc gặp tình cờ.',
    destination: 'Hà Giang',
    image: 'photo-1464822759023-fed622ff2c3b',
    read: '07 PHÚT',
    sections: [
      {
        title: 'Con đường không đi theo đường thẳng',
        paragraphs: [
          'Những khúc cua nối tiếp nhau giữa núi đá, mở ra tầm nhìn rộng rồi lại khép vào một thung lũng nhỏ. Cảnh vật thay đổi theo từng đoạn đường.',
          'Điều đáng nhớ không chỉ là độ cao hay cung đường, mà còn là những điểm dừng bất ngờ để nhìn mây trôi và nghe gió lùa qua sườn núi.',
        ],
        image: 'photo-1528127269322-539801943592',
      },
      {
        title: 'Những cuộc gặp trên đường',
        paragraphs: [
          'Một phiên chợ, một quán nhỏ hay lời chỉ đường thân tình có thể làm thay đổi nhịp của cả ngày. Mỗi cuộc gặp cho ta hiểu thêm về vùng đất qua góc nhìn của người địa phương.',
          'Hà Giang đáng nhớ bởi sự rộng lớn của núi rừng và cả sự gần gũi trong những khoảnh khắc rất đời thường.',
        ],
      },
    ],
  },
]

export const featureItems = [
  {
    number: '01',
    title: 'Không gian mở rộng',
    description: 'Ảnh toàn cảnh gợi ra nhiều góc nhìn về cảnh sắc và không gian của một miền đất.',
    image: 'photo-1501785888041-af3ef285b470',
  },
  {
    number: '02',
    title: 'Âm thanh bản địa',
    description: 'Tiếng gió, tiếng nước và lời kể có thể đưa người xem đến gần hơn với đời sống địa phương.',
    image: 'photo-1528181304800-259b08848526',
  },
  {
    number: '03',
    title: 'Những câu chuyện bằng hình',
    description: 'Bộ ảnh được biên tập theo chủ đề, địa danh và cảm hứng của từng hành trình.',
    image: 'photo-1504674900247-0877df9cc836',
  },
  {
    number: '04',
    title: 'Dẫn lối khám phá',
    description: 'Các điểm chạm nội dung gợi ý những câu chuyện và địa danh có liên quan.',
    image: 'photo-1510414842594-a61c69b5ae57',
  },
]

export function resolveContentRoute(pathname: string): ContentRoute | null {
  const path = pathname.replace(/\/+$/, '')
  const match = /^\/(solutions|experiences|blog)\/([^/]+)$/.exec(path)
  if (!match) return null

  const collection = match[1] as ContentCollection
  const slug = match[2]
  const items = collection === 'solutions'
    ? solutionItems
    : collection === 'experiences'
      ? experienceItems
      : storyItems

  return items.some((item) => item.slug === slug) ? { collection, slug } : null
}

export function getContentTitle(pathname: string): string | null {
  const route = resolveContentRoute(pathname)
  if (!route) return null
  const items = route.collection === 'solutions'
    ? solutionItems
    : route.collection === 'experiences'
      ? experienceItems
      : storyItems
  return items.find((item) => item.slug === route.slug)?.title ?? null
}
