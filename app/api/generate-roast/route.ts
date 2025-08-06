import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { input, style, language } = await request.json();

    // Validate required fields
    if (!input || !style || !language) {
      return NextResponse.json(
        {
          error: "Missing required fields: input, style, language"
        },
        { status: 400 }
      );
    }

    // ✅ Hugging Face Free API (1000 requests/month)
    const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

    if (HF_API_KEY && HF_API_KEY !== "your-api-key-here") {
      try {
        // Better model and prompt for roasting
        const response = await fetch(
          "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
          {
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
              inputs: `Generate a ${style} roast in ${language} language for: ${input}`,
              parameters: {
                max_length: 150,
                temperature: 0.9,
                do_sample: true,
                repetition_penalty: 1.3, // Avoid repetition
                top_p: 0.9,
                top_k: 50
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          let roast = data[0]?.generated_text || data.generated_text;

          if (roast && roast.length > 10) {
            // Clean up the AI response
            roast = roast.replace(/^.*?Generate.*?for:\s*/i, "").trim();
            roast = roast.split("\n")[0].trim(); // Take first line only

            return NextResponse.json({
              roast,
              source: "ai",
              model: "huggingface"
            });
          }
        }
      } catch (hfError) {
        console.error("Hugging Face API error:", hfError);
      }
    }

    // ✅ Fallback to expanded sample roasts
    return NextResponse.json({
      roast: getExpandedSampleRoast(style, language),
      source: "sample"
    });
  } catch (error) {
    console.error("API Error:", error);

    // Final fallback
    return NextResponse.json(
      {
        roast:
          "Sorry, I couldn't generate a roast right now. Your beauty is so overwhelming it crashed my system!",
        source: "error"
      },
      { status: 500 }
    );
  }
}

function getExpandedSampleRoast(style: string, language: string) {
  const expandedRoasts = {
    english: {
      savage: [
        "Holy shit, looking at your photo made my AI crash twice. Even my algorithms are trying to unsee this disaster.",
        "Damn, you're so basic that even vanilla ice cream has more personality than your entire existence.",
        "Your face is the reason why aliens haven't visited Earth yet. They saw you and noped the fuck out.",
        "You're like a software update nobody wants - always popping up at the worst time.",
        "If disappointment was a person, it would look exactly like you and still be embarrassed.",
        "You're the human equivalent of a participation trophy - present but not achieving anything.",
        "Your personality has the depth of a puddle in the Sahara desert.",
        "You're proof that natural selection sometimes takes extended coffee breaks.",
        "Even your reflection tries to look away when you pass a mirror.",
        "You're like a broken pencil - completely pointless and nobody wants to use you.",
        "Your existence is like a typo in the book of life - it shouldn't be there but somehow it is.",
        "You're so forgettable that even Google can't find any results about you.",
        "If stupidity burned calories, you'd be the fittest person alive.",
        "You're like a Windows error message - annoying, unwanted, and nobody knows how to fix you.",
        "Your life is like airplane WiFi - barely working and disappointing everyone."
      ],
      witty: [
        "You're like Internet Explorer - slow, outdated, and everyone's trying to replace you with something better.",
        "If stupidity was a superpower, you'd be fucking Superman flying around saving nobody.",
        "You're proof that evolution sometimes takes a coffee break and forgets what it's doing.",
        "You're the human equivalent of a participation trophy - nobody earned you but here you are.",
        "I've seen more personality in a Windows error message than in your entire existence.",
        "You're like a dictionary - you have all the words but no one wants to read you.",
        "Your IQ is so low it's practically a limbo contest.",
        "You're like a smartphone with 1% battery - barely functional and about to die.",
        "If life was a video game, you'd be the tutorial everyone skips.",
        "You're like a Netflix recommendation - nobody asked for you but you keep showing up.",
        "Your brain is like a browser with 47 tabs open - slow, confused, and about to crash.",
        "You're the reason they put instructions on shampoo bottles.",
        "If common sense was currency, you'd be living in poverty.",
        "You're like a GPS that always takes the longest route - technically working but incredibly inefficient.",
        "Your thought process is like dial-up internet - slow, outdated, and frustrating for everyone involved."
      ],
      brutal: [
        "Jesus fucking Christ, what happened to your face? Did you lose a fight with a blender?",
        "You're so ugly, when you were born the doctor slapped your parents instead of you.",
        "Damn bro, you look like you were assembled by someone who had never seen a human before.",
        "Your face could be used as birth control - just show it to people and boom, instant abstinence.",
        "You're the reason why some animals eat their young.",
        "You look like you were drawn by someone wearing oven mitts.",
        "Your gene pool needs a lifeguard because clearly someone's drowning in there.",
        "You're so ugly you make blind kids cry.",
        "If you were twice as smart, you'd still be stupid.",
        "You're the reason God doesn't talk to us anymore.",
        "Your family tree must be a cactus because everybody on it is a prick.",
        "You're so ugly you scared the crap out of a toilet.",
        "Looking at you is like looking at a car accident - horrifying but I can't look away.",
        "You're the human equivalent of a migraine.",
        "If I had a dollar for every brain cell you have, I'd have 25 cents."
      ],
      playful: [
        "Aww, you're like a participation trophy - nobody really wanted you, but here you are anyway!",
        "You're so cute! Like a pug - ugly but in an endearing way that makes people feel sorry for you.",
        "Bless your heart, you're trying so hard! It's like watching a penguin try to fly - hilarious but sad.",
        "You're like a golden retriever - adorable, loyal, but definitely not the brightest bulb in the box.",
        "You have the confidence of a mediocre white man and the skills to match!",
        "You're like a GPS that's permanently set to 'scenic route' - you'll get there eventually, maybe.",
        "Aww, you're like a knock-off designer bag - trying your best to look expensive but fooling nobody.",
        "You're adorable in the same way a three-legged puppy is - everyone feels bad but nobody knows what to do.",
        "You're like a chocolate teapot - sweet but completely useless.",
        "Bless you, you're like autocorrect - trying to help but usually making things worse.",
        "You're like a solar-powered flashlight - great idea in theory, questionable in practice.",
        "You're precious like a participation award - everyone gets one and nobody really wants it.",
        "You're like a diet soda - technically functional but leaves everyone feeling unsatisfied.",
        "Aww, you're like a pet rock - low maintenance but doesn't really do much.",
        "You're charming like a dad joke - nobody admits to liking you but secretly we all do."
      ]
    },
    hindi: {
      savage: [
        "भाई तेरी शक्ल देखकर मेरा AI भी हैंग हो गया। भगवान ने तुझे बनाते वक्त जरूर कोई गलती की है।",
        "तू इतना बेकार है कि तेरे सामने प्याज भी रोना बंद कर देता है।",
        "तेरी फोटो देखकर लगता है जैसे भगवान ने नशे में तुझे बनाया हो।",
        "तू software update की तरह है - कोई नहीं चाहता लेकिन फिर भी आता रहता है।",
        "अगर निराशा का कोई चेहरा होता तो वो तेरा ही होता, और फिर भी शर्मिंदा होता।",
        "तू participation trophy की तरह है - मौजूद तो है लेकिन कुछ achieve नहीं कर रहा।",
        "तेरी personality एक रेगिस्तानी तालाब जितनी गहरी है।",
        "तू इस बात का सबूत है कि evolution कभी-कभी लंबी coffee break लेता है।",
        "तेरा reflection भी आईने में अपना मुंह छुपाता है।",
        "तू टूटी पेंसिल की तरह है - बिल्कुल बेकार और कोई इस्तेमाल नहीं करना चाहता।",
        "तेरा अस्तित्व जिंदगी की किताब में एक typo है - होना नहीं चाहिए था लेकिन है।",
        "तू इतना भुलक्कड़ है कि Google भी तेरे बारे में कुछ नहीं ढूंढ पाता।",
        "अगर बेवकूफी से calories burn होती तो तू दुनिया का सबसे fit आदमी होता।",
        "तू Windows error message की तरह है - irritating, unwanted, और कोई fix नहीं कर सकता।",
        "तेरी जिंदगी airplane WiFi की तरह है - मुश्किल से काम करती है और सबको disappoint करती है।"
      ],
      witty: [
        "तू बिल्कुल Internet Explorer की तरह है - धीमा, पुराना, और सबको तुझसे छुटकारा चाहिए।",
        "अगर बेवकूफी Olympic sport होती तो तू gold medal जीत जाता।",
        "तेरा दिमाग इतना खाली है कि उसमें echo सुनाई देती है।",
        "तू participation trophy की तरह है - कोई deserve नहीं करता लेकिन मिल जाता है।",
        "मैंने Windows error message में भी तुझसे ज्यादा personality देखी है।",
        "तू dictionary की तरह है - सारे words हैं लेकिन कोई पढ़ना नहीं चाहता।",
        "तेरा IQ इतना कम है कि ये limbo contest लगता है।",
        "तू 1% battery वाले smartphone की तरह है - barely काम करता है और मरने वाला है।",
        "अगर life video game होती तो तू वो tutorial होता जिसे सब skip करते हैं।",
        "तू Netflix recommendation की तरह है - कोई नहीं मांगता लेकिन दिखता रहता है।",
        "तेरा brain 47 tabs खुले browser की तरह है - slow, confused, और crash होने वाला।",
        "तेरी वजह से shampoo bottles पर instructions लिखने पड़ते हैं।",
        "अगर common sense currency होती तो तू गरीबी में जी रहा होता।",
        "तू GPS की तरह है जो हमेशा लंबा route बताता है - technically काम करता है लेकिन बहुत inefficient।",
        "तेरी thinking process dial-up internet की तरह है - slow, outdated, और सबके लिए frustrating।"
      ],
      brutal: [
        "भोसड़ी के, तेरे चेहरे को देख के ऐसा लगता है जैसे भगवान ने sculpting छोड़कर सीधे जूते से shape दी हो।",
        "मादरचोद, तू वो गलती है जो condoms की warning label बनने से पहले हो गई थी।",
        "बहनचोद, तू इतना बेकार है कि अगर तेरे जैसे दो और हो जाएं तो पृथ्वी स्वेच्छा से explode कर दे।",
        "अबे हरामी, तेरे चेहरे से ज्यादा तो कमोड का ढक्कन decent लगता है, कम से कम उसमें consistency तो है।",
        "तू दिखने में ऐसा लगता है जैसे इंसान की फाइल corrupt हो गई हो और system ने default 'गांडू' version लोड कर लिया हो।",
        "भोसड़ी के, तुझे देख कर लगता है evolution ने तुझे half-download कर के छोड़ दिया।",
        "तेरी शक्ल ऐसी है जैसे किसी ने गू से मूर्ति बना दी हो और उसपर गलती से जान आ गई।",
        "मादरचोद, तुझसे बात करने से बेहतर है दीवार से बहस करना, कम से कम वो उतनी बकचोदी नहीं करती।",
        "तेरे अंदर का logic और तेरे बाप की savings — दोनों कभी दिखे ही नहीं बहनचोद।",
        "तेरी शक्ल देख के तो mirror भी self-respect में खुद को तोड़ दे हरामी।",
        "भोसड़ीवाले, तू वो बंदा है जो किसी भी group में हो तो group खुद suicide कर ले।",
        "तू इतना चुतिया है कि तुझे देखकर AI भी बोल दे, 'इसको तो हम नहीं सुधार सकते'।",
        "मादरचोद, तू उस WhatsApp ग्रुप की तरह है जिसे सब mute कर देते हैं और फिर भी delete नहीं करते — बेकार, annoying, और uninvited।",
        "तेरे जैसे लोगों की वजह से ही aliens धरती पर नहीं आ रहे, उन्हें डर है कि कहीं तू ambassador बन गया तो क्या होगा।",
        "तू वो इंसान है जिसे देख कर depression भी consult लेने चला जाए कि 'मुझे इससे दूर रखो'।"
      ],
      playful: [
        "अरे यार, तू बिल्कुल golden retriever की तरह है - प्यारा लेकिन दिमाग जीरो!",
        "तू वो दोस्त है जिसे सब हंसी-मजाक के लिए रखते हैं। Thanks for entertainment!",
        "भगवान तेरा भला करे, तू कितनी कोशिश करता है! Penguin को उड़ते देखने जैसा है।",
        "तू pug की तरह है - भद्दा लेकिन प्यारे तरीके से जिसे देखकर लोगों को तरस आता है।",
        "तेरे अंदर mediocre white man जितना confidence है और skills भी उतनी ही!",
        "तू scenic route वाले GPS की तरह है - eventually पहुंच जाएगा, शायद।",
        "अरे यार, तू knock-off designer bag की तरह है - expensive दिखने की कोशिश करता है लेकिन कोई fool नहीं होता।",
        "तू तीन पैर वाले puppy की तरह adorable है - सबको तरस आता है लेकिन कोई नहीं जानता क्या करना है।",
        "तू chocolate teapot की तरह है - मीठा लेकिन बिल्कुल useless।",
        "भगवान तुझे ठीक रखे, तू autocorrect की तरह है - help करने की कोशिश करता है लेकिन usually बदतर बना देता है।",
        "तू solar-powered flashlight की तरह है - theory में great idea, practice में questionable।",
        "तू participation award की तरह precious है - सबको मिलता है और कोई नहीं चाहता।",
        "तू diet soda की तरह है - technically functional लेकिन सबको unsatisfied feel होता है।",
        "अरे यार, तू pet rock की तरह है - low maintenance लेकिन ज्यादा कुछ करता नहीं।",
        "तू dad joke की तरह charming है - कोई admit नहीं करता कि पसंद है लेकिन secretly सबको अच्छा लगता है।"
      ]
    },
    bengali: {
      savage: [
        "ওরে ভাই, তোর মুখ দেখে আমার AI-ও crash করে গেছে। ভগবান তোকে বানানোর সময় নিশ্চয়ই ভুল করেছেন।",
        "তুই এত বাজে যে তোর সামনে পেঁয়াজও কাঁদা বন্ধ করে দেয়।",
        "তোর ছবি দেখে মনে হচ্ছে ভগবান নেশা করে তোকে বানিয়েছেন।",
        "তুই software update এর মতো - কেউ চায় না কিন্তু তবুও আসতেই থাকিস।",
        "যদি হতাশার কোনো মুখ থাকত তাহলে সেটা তোর মতোই হতো, আর তারপরেও লজ্জিত হতো।",
        "তুই participation trophy এর মতো - আছিস তো কিন্তু কিছু achieve করতে পারিস না।",
        "তোর personality মরুভূমির একটা পুকুরের মতো গভীর।",
        "তুই এই প্রমাণ যে evolution মাঝে মাঝে লম্বা coffee break নেয়।",
        "তোর reflection-ও আয়নায় মুখ লুকায়।",
        "তুই ভাঙা পেন্সিলের মতো - সম্পূর্ণ অর্থহীন আর কেউ ব্যবহার করতে চায় না।",
        "তোর অস্তিত্ব জীবনের বইয়ে একটা typo - থাকার কথা ছিল না কিন্তু আছে।",
        "তুই এত ভুলোমনা যে Google-ও তোর সম্পর্কে কিছু খুঁজে পায় না।",
        "যদি বোকামিতে calories পোড়ত তাহলে তুই পৃথিবীর সবচেয়ে fit মানুষ হতিস।",
        "তুই Windows error message এর মতো - বিরক্তিকর, অবাঞ্ছিত, আর কেউ ঠিক করতে পারে না।",
        "তোর জীবন airplane WiFi এর মতো - কমই কাজ করে আর সবাইকে disappointed করে।"
      ],
      witty: [
        "তুই একদম Internet Explorer এর মতো - ধীর, পুরানো, আর সবাই তোর থেকে মুক্তি চায়।",
        "যদি বোকামি Olympic sport হতো তাহলে তুই gold medal জিতে যেতিস।",
        "তোর মাথা এত খালি যে ওখানে echo শোনা যায়।",
        "তুই participation trophy এর মতো - কেউ deserve করে না কিন্তু পেয়ে যায়।",
        "আমি Windows error message এও তোর থেকে বেশি personality দেখেছি।",
        "তুই dictionary এর মতো - সব words আছে কিন্তু কেউ পড়তে চায় না।",
        "তোর IQ এত কম যে এটা limbo contest মনে হয়।",
        "তুই ১% battery এর smartphone এর মতো - কমই কাজ করে আর মরতে বসেছে।",
        "যদি জীবন video game হতো তাহলে তুই সেই tutorial হতিস যেটা সবাই skip করে।",
        "তুই Netflix recommendation এর মতো - কেউ চায় না কিন্তু দেখাতেই থাকিস।",
        "তোর brain ৪৭টা tab খোলা browser এর মতো - slow, confused, আর crash হওয়ার অবস্থা।",
        "তোর জন্যই shampoo bottles এ instructions লিখতে হয়।",
        "যদি common sense currency হতো তাহলে তুই দরিদ্রতায় বাঁচতিস।",
        "তুই GPS এর মতো যেটা সবসময় লম্বা route বলে - technically কাজ করে কিন্তু খুবই inefficient।",
        "তোর thinking process dial-up internet এর মতো - slow, outdated, আর সবার জন্য frustrating।"
      ],
      brutal: [
        "শালার বাচ্চা, তোর মুখ দেখে মনে হচ্ছে তোকে mixer-এ ফেলে বানানো হয়েছে।",
        "হারামজাদা, তুই এত নোংরা দেখতে যে কুকুরেরাও তোর থেকে দূরে পালায়।",
        "বেশ্যার পোলা, তোর মুখ দেখে contraceptive ads বানানো উচিত।",
        "তোর মুখ birth control এর কাজ করতে পারে - শুধু দেখিয়ে দাও আর instant abstinence।",
        "তোর জন্যই কিছু প্রাণী তাদের বাচ্চাদের খেয়ে ফেলে।",
        "তোকে দেখে মনে হয় oven mitts পরে draw করা হয়েছে।",
        "তোর gene pool এ lifeguard দরকার কারণ clearly কেউ ডুবে যাচ্ছে।",
        "তুই এত কুৎসিত যে অন্ধ বাচ্চারাও কাঁদে।",
        "যদি তুই দ্বিগুণ smart হতিস তাহলেও stupid থেকে যেতিস।",
        "তোর জন্যই ভগবান আমাদের সাথে কথা বলা বন্ধ করেছেন।",
        "তোর family tree নিশ্চয়ই cactus কারণ সবাই prick।",
        "তুই এত ugly যে toilet-ও ভয় পায়।",
        "তোকে দেখা car accident দেখার মতো - ভয়ানক কিন্তু চোখ ফেরাতে পারি না।",
        "তুই migraine এর human version।",
        "যদি তোর প্রতিটা brain cell এর জন্য আমার এক টাকা পেতাম তাহলে আমার পাঁচ টাকা হতো।"
      ],
      playful: [
        "অরে ইয়ার, তুই একদম golden retriever এর মতো - মিষ্টি কিন্তু বুদ্ধি জিরো!",
        "তুই সেই বন্ধু যাকে সবাই হাসি-তামাশার জন্য রাখে। Thanks for entertainment!",
        "আল্লাহ তোর মঙ্গল করুক, তুই কত চেষ্টা করিস! Penguin কে উড়তে দেখার মতো।",
        "তুই pug এর মতো - কুৎসিত কিন্তু এমন ভাবে যে লোকের দয়া হয়।",
        "তোর মধ্যে mediocre white man এর মতো confidence আছে আর skills ও ততটাই!",
        "তুই scenic route এর GPS এর মতো - eventually পৌঁছাবি, হয়তো।",
        "অরে ইয়ার, তুই knock-off designer bag এর মতো - expensive দেখানোর চেষ্টা করিস কিন্তু কাউকে fool করতে পারিস না।",
        "তুই তিন পায়ের কুকুরছানার মতো adorable - সবার দয়া হয় কিন্তু কী করবে কেউ জানে না।",
        "তুই chocolate teapot এর মতো - মিষ্টি কিন্তু সম্পূর্ণ অকেজো।",
        "আল্লাহ তোকে ভালো রাখুক, তুই autocorrect এর মতো - help করার চেষ্টা করিস কিন্তু usually আরো খারাপ করে দাও।",
        "তুই solar-powered flashlight এর মতো - theory তে great idea, practice এ questionable।",
        "তুই participation award এর মতো precious - সবাই পায় আর কেউ চায় না।",
        "তুই diet soda এর মতো - technically functional কিন্তু সবাই unsatisfied feel করে।",
        "অরে ইয়ার, তুই pet rock এর মতো - low maintenance কিন্তু তেমন কিছু করে না।",
        "তুই dad joke এর মতো charming - কেউ admit করে না যে পছন্দ কিন্তু secretly সবার ভালো লাগে।"
      ]
    }
  };

  const languageRoasts =
    expandedRoasts[language as keyof typeof expandedRoasts] ||
    expandedRoasts.english;
  const styleRoasts =
    languageRoasts[style as keyof typeof languageRoasts] ||
    languageRoasts.savage;
  return styleRoasts[Math.floor(Math.random() * styleRoasts.length)];
}
