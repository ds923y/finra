package com.example.helloendpoints;

/**
 * Created by administrator on 3/24/16.
 */
public class Tumbler {

    private char displayVal;
    private Tumbler next;
    //private static final int[] bases = new int[]{1,1,3,3,3,3,3,4,3,4};
    private static final int[] bases = new int[]{1,1,4,4,4,4,4,5,4,5};
    private static final char[] indexing = new char[]{'.','.','a','d','g','j','m','p','t','w'};

    public static int getCount(String s){
        int result = 1;
        for(char c : s.toCharArray()){
            int bindexs = c - '0';
            result *= bases[bindexs];
        }
        return result;
    }

    public Tumbler(String delinkingString){
        String nextTumblers = delinkingString.substring(1);
        displayVal = delinkingString.charAt(0);
        if(nextTumblers.equals("")){
            next = null;
        }else{
           next = new Tumbler(nextTumblers);
        }
    }

    public Tumbler(String delinkingString, int offset){
        String nextTumblers = delinkingString.substring(1);
        displayVal = delinkingString.charAt(0);
        int bindexs = delinkingString.charAt(0) - '0';
        int base = bases[bindexs];

        int numTumbles = offset % base;
        if(numTumbles-- > 0){
            displayVal = indexing[bindexs];
            while(numTumbles-- > 0){
                displayVal++;
            }
        }

        if(nextTumblers.equals("")){
            next = null;
        }else{
            next = new Tumbler(nextTumblers, offset / base);
        }
    }

    public static int[] indexTo(String s, int offset){
        int[] toReturn = new int[s.length()];
        for(int i = 0; i < s.length(); i++) {
            int bindexs = s.charAt(i) - '0';
            int base = bases[bindexs];
            int numTumbles = offset % base;
            offset = offset / base;
            toReturn[i] = numTumbles;
        }
        return toReturn;
    }


    private void propogate(){
        if(next != null)
            next.tumble();
    }

    public String stringify(String current){
        if(next == null)
            return current + displayVal;
        else
            return next.stringify(current + displayVal);
    }

    @Override
    public String toString(){
        return stringify("");
    }



    public void tumble(){
        switch(displayVal){
            case '1':
                propogate();
                break;
            case '2':
                displayVal = 'a';
                break;
            case '3':
                displayVal = 'd';
                break;
            case '4':
                displayVal = 'g';
                break;
            case '5':
                displayVal = 'j';
                break;
            case '6':
                displayVal = 'm';
                break;
            case '7':
                displayVal = 'p';
                break;
            case '8':
                displayVal = 't';
                break;
            case '9':
                displayVal = 'w';
                break;
            case '0':
                propogate();
                break;
            case 'a':
            case 'b':
            case 'd':
            case 'e':
            case 'g':
            case 'h':
            case 'j':
            case 'k':
            case 'm':
            case 'n':
            case 'p':
            case 'q':
            case 'r':
            case 't':
            case 'u':
            case 'w':
            case 'x':
            case 'y':
                displayVal++;
                break;
            case 'c':
                displayVal = '2';
                propogate();
                break;
            case 'f':
                displayVal = '3';
                propogate();
                break;
            case 'i':
                displayVal = '4';
                propogate();
                break;
            case 'l':
                displayVal = '5';
                propogate();
                break;
            case 'o':
                displayVal = '6';
                propogate();
                break;
            case 's':
                displayVal = '7';
                propogate();
                break;
            case 'v':
                displayVal = '8';
                propogate();
                break;
            case 'z':
                displayVal = '9';
                propogate();
                break;
        }
    }
}
